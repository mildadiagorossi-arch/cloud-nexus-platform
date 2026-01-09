import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    HttpCode,
    HttpStatus,
    Req,
    Res,
} from '@nestjs/common';
import {
    AuthService,
    RegisterDto,
    LoginDto,
    AuthResponse,
} from '../../../application/services/AuthService';
import { JwtAuthGuard } from '../../../application/auth/JwtAuthGuard';
import { GoogleAuthGuard } from '../../../application/auth/GoogleAuthGuard';
import { CurrentUser } from '../../../application/auth/decorators/CurrentUser';
import { Public } from '../../../application/auth/decorators/Public';
import { User } from '../../../domain/entities/User';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /**
     * Inscription d'un nouvel utilisateur
     */
    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(dto);
    }

    /**
     * Connexion de l'utilisateur
     */
    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(dto);
    }

    /**
     * Récupération du profil de l'utilisateur connecté
     */
    @UseGuards(JwtAuthGuard)
    @Get('me')
    @HttpCode(HttpStatus.OK)
    async getProfile(@CurrentUser() user: User) {
        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        };
    }

    /**
     * Google OAuth - Initiate
     */
    @Public()
    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        // Redirects to Google
    }

    /**
     * Google OAuth - Callback
     */
    @Public()
    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Req() req: any, @Res() res: any) {
        // Generate JWT for the user
        const payload = { userId: req.user.id, email: req.user.email };
        const token = this.authService.generateToken(payload);

        // Redirect to frontend with token
        res.redirect(`http://localhost:8082/auth/callback?token=${token}`);
    }
}
