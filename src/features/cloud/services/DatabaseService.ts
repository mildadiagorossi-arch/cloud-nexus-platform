import type { components } from '../../../lib/api/schema';
import { AuthService } from '../../auth/services/AuthService';

type CreateDatabaseDto = components['schemas']['CreateDatabaseDto'];

interface Database {
    id: string;
    name: string;
    engine: string;
    version: string;
    status: string;
    connectionString: string;
    createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class DatabaseService {
    private static getAuthHeaders() {
        const token = AuthService.getToken();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    static async getAll(): Promise<Database[]> {
        const response = await fetch(`${API_URL}/databases`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch databases');
        }

        return response.json();
    }

    static async getById(id: string): Promise<Database> {
        const response = await fetch(`${API_URL}/databases/${id}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch database');
        }

        return response.json();
    }

    static async create(dto: CreateDatabaseDto): Promise<Database> {
        const response = await fetch(`${API_URL}/databases`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create database');
        }

        return response.json();
    }

    static async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/databases/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to delete database');
        }
    }
}
