import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  //TODO: Container IOC
  const app = await NestFactory.create(AppModule);

  //TODO: Middleware -> Guards -> Interceptors -> Pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  //TODO: Swagger integration
  const config = new DocumentBuilder()
    .setTitle('Task Manager')
    .setDescription('Task Manager API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
