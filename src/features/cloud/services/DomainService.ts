import type { components } from '../../../lib/api/schema';
import { AuthService } from '../../auth/services/AuthService';

type CreateDomainDto = components['schemas']['CreateDomainDto'];

interface Domain {
    id: string;
    name: string;
    status: string;
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class DomainService {
    private static getAuthHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    static async getAll(): Promise<Domain[]> {
        const response = await fetch(`${API_URL}/domains`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch domains');
        }

        return response.json();
    }

    static async getById(id: string): Promise<Domain> {
        const response = await fetch(`${API_URL}/domains/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch domain');
        }

        return response.json();
    }

    static async create(dto: CreateDomainDto): Promise<Domain> {
        const response = await fetch(`${API_URL}/domains`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create domain');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/domains/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete domain');
        }
    }
}
