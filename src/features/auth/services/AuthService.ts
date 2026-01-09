import type { components, operations } from '../../../lib/api/schema';

type LoginDto = components['schemas']['LoginDto'];
type RegisterDto = components['schemas']['RegisterDto'];

interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AuthService {
    private static token: string | null = localStorage.getItem('token');

    static setToken(token: string) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    static getToken(): string | null {
        return this.token;
    }

    static clearToken() {
        this.token = null;
        localStorage.removeItem('token');
    }

    static async login(dto: LoginDto): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        const data: AuthResponse = await response.json();
        this.setToken(data.accessToken);
        return data;
    }

    static async register(dto: RegisterDto): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        const data: AuthResponse = await response.json();
        this.setToken(data.accessToken);
        return data;
    }

    static async getProfile(): Promise<AuthResponse['user']> {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return response.json();
    }

    static isAuthenticated(): boolean {
        return !!this.token;
    }
}
