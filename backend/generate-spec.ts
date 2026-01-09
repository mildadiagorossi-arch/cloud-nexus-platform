import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    const config = new DocumentBuilder()
        .setTitle('Cloud Nexus API')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app as any, config);
    fs.writeFileSync('./openapi-spec.json', JSON.stringify(document));
    await app.close();
}
bootstrap();
