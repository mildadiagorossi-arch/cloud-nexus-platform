import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { emails, displayName, photos } = profile;
        const email = emails[0].value;

        try {
            // Find or create user
            let user = await this.prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email,
                        name: displayName,
                        passwordHash: '', // Google users don't have password
                    },
                });
            }

            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
}
