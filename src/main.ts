import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. REGLA DEL EXAMEN: Uso de whitelist y forbidNonWhitelisted
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Quita datos basura que manden en el JSON
      forbidNonWhitelisted: true, // Marca error si mandan datos no permitidos (ej. si intentan mandar 'role' en el registro)
      transform: true,
    }),
  );

  // 2. REGLA DEL EXAMEN: Documentación Swagger
  const config = new DocumentBuilder()
    .setTitle('API REST Segura - Examen')
    .setDescription('Gestión de usuarios con control de acceso basado en roles')
    .setVersion('1.0')
    .addBearerAuth() // Esto pone el botoncito de "Authorize" en Swagger para probar los JWT
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  
  // Usamos el puerto que asigne Render, o el 3000 en local
  await app.listen(process.env.PORT || 3000);
}
bootstrap();