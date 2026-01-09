import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
    userId?: string;
}

@WebSocketGateway({
    cors: {
        origin: '*',
        credentials: true,
    },
})
@Injectable()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy {
    @WebSocketServer()
    server: Server;

    private metricsInterval: NodeJS.Timeout;

    constructor(private readonly jwtService: JwtService) { }

    onModuleInit() {
        this.afterInit();
    }

    afterInit() {
        console.log('WebSocket Gateway initialisé');

        // Démarrer la diffusion des métriques toutes les 5 secondes
        this.metricsInterval = setInterval(() => {
            this.broadcastMetrics();
        }, 5000);
    }

    async handleConnection(client: AuthenticatedSocket) {
        try {
            // Extraire le token de l'en-tête ou de la query
            const token = client.handshake.auth?.token || client.handshake.query?.token;

            if (token) {
                const payload = this.jwtService.verify(token as string);
                client.userId = payload.sub; // Or payload.userId depending on how we sign it. 
                // In AuthService we did: sign({ userId: ... })
                // So payload has userId, not sub (unless we change it).
                // Let's assume standard sub for now or check AuthService.
                // AuthService: const payload = { userId: user.id, email: user.email };
                // So we should check payload.userId. 
                // But I will stick to USER CODE for now and maybe add a comment or fix it if I see it failing.
                // User code: client.userId = payload.sub; 
                // I will trust user code but if it fails I'll know why.
                // Actually, let's fix it to match MY AuthService implementation to avoid "it doesn't work" later.
                // My AuthService uses `userId`.
                // I'll adjust `client.userId = payload.userId || payload.sub;` to be safe.
                client.userId = (payload as any).userId || payload.sub;
                console.log(`Client connecté: ${client.id} (userId: ${client.userId})`);
            } else {
                console.log(`Client connecté sans auth: ${client.id}`);
            }
        } catch (error) {
            console.log(`Erreur d'authentification pour ${client.id}`);
            // create a soft disconnect or just log? User code just logged.
        }
    }

    handleDisconnect(client: AuthenticatedSocket) {
        console.log(`Client déconnecté: ${client.id}`);
    }

    @SubscribeMessage('join:team')
    handleJoinTeam(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() teamId: string) {
        client.join(`team:${teamId}`);
        console.log(`Client ${client.id} a rejoint l'équipe ${teamId}`);

        // Notifier les autres membres
        client.to(`team:${teamId}`).emit('team:member-joined', {
            userId: client.userId,
            socketId: client.id,
        });

        return { success: true, teamId };
    }

    @SubscribeMessage('leave:team')
    handleLeaveTeam(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() teamId: string) {
        client.leave(`team:${teamId}`);
        console.log(`Client ${client.id} a quitté l'équipe ${teamId}`);

        // Notifier les autres membres
        client.to(`team:${teamId}`).emit('team:member-left', {
            userId: client.userId,
            socketId: client.id,
        });

        return { success: true, teamId };
    }

    @SubscribeMessage('resource:update')
    handleResourceUpdate(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: any) {
        // Diffuser la mise à jour aux autres clients de la même équipe
        if (data.teamId) {
            client.to(`team:${data.teamId}`).emit('resource:updated', data);
        }
    }

    // Méthodes pour diffuser des événements depuis les services
    notifyDropletCreated(teamId: string, droplet: any) {
        this.server.to(`team:${teamId}`).emit('droplet:created', droplet);
    }

    notifyDropletStatusChanged(teamId: string, dropletId: string, status: string) {
        this.server.to(`team:${teamId}`).emit('droplet:status-changed', {
            dropletId,
            status,
        });
    }

    private broadcastMetrics() {
        // Générer des métriques simulées
        const metrics = {
            timestamp: new Date().toISOString(),
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            network: {
                in: Math.random() * 1000,
                out: Math.random() * 1000,
            },
        };

        // Diffuser à tous les clients connectés
        this.server.emit('metrics:update', metrics);
    }

    onModuleDestroy() {
        if (this.metricsInterval) {
            clearInterval(this.metricsInterval);
        }
    }
}
