import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        rawBody: true, // Nécessaire pour les webhooks Stripe
    });

    // CORS
    app.enableCors({
        origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8082'],
        credentials: true,
    });

    // Configuration Swagger
    const config = new DocumentBuilder()
        .setTitle('Cloud Nexus API')
        .setDescription('API documentation for Cloud Nexus Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app as any, config);
    SwaggerModule.setup('api', app as any, document);

    // Validation globale des DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Retire les propriétés non définies dans les DTOs
            forbidNonWhitelisted: true, // Lance une erreur si propriétés non whitelistées
            transform: true, // Transforme automatiquement les types
        }),
    );

    // Configuration pour les webhooks Stripe
    // Le raw body doit être disponible pour /billing/webhook
    app.use((req, res, next) => {
        if (req.originalUrl === '/billing/webhook') {
            next();
        } else {
            json()(req, res, next);
        }
    });

    app.use(urlencoded({ extended: true }));

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`🚀 Application démarrée sur http://localhost:${port}`);
    console.log(`📡 WebSocket disponible sur ws://localhost:${port}`);
}

bootstrap();
