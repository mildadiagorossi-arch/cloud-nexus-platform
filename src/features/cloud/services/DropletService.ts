import type { components } from '../../../lib/api/schema';
import { AuthService } from '../../auth/services/AuthService';

type CreateDropletDto = components['schemas']['CreateDropletDto'];

interface Droplet {
    id: string;
    name: string;
    region: string;
    size: string;
    status: string;
    ipAddress: string;
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class DropletService {
    private static getAuthHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    static async getAll(): Promise<Droplet[]> {
        const response = await fetch(`${API_URL}/droplets`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch droplets');
        }

        return response.json();
    }

    static async getById(id: string): Promise<Droplet> {
        const response = await fetch(`${API_URL}/droplets/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch droplet');
        }

        return response.json();
    }

    static async create(dto: CreateDropletDto): Promise<Droplet> {
        const response = await fetch(`${API_URL}/droplets`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create droplet');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/droplets/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete droplet');
        }
    }

    static async reboot(id: string): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/droplets/${id}/reboot`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to reboot droplet');
        }

        return response.json();
    }
}
