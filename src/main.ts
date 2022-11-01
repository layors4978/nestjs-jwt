import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('JWT test')
    .setDescription('access token and refresh token')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
