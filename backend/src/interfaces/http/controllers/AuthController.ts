import {
    Body,
    Controller,
    Post,
    Get,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    AuthService,
    RegisterDto,
    LoginDto,
    AuthResponse,
} from '../../../application/services/AuthService';
import { JwtAuthGuard } from '../../../application/auth/JwtAuthGuard';
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
                // Ajoutez d'autres champs non sensibles si nécessaire (ex: role, createdAt, etc.)
            },
        };
    }
}
