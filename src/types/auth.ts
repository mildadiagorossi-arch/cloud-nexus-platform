
export type UserRole = 'admin' | 'seller' | 'client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}
