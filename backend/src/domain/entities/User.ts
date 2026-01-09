export class User {
    id: string;
    email: string;
    name?: string | null;
    passwordHash?: string;
    createdAt: Date;
    updatedAt: Date;
}
