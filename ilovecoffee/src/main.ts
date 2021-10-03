import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any property from body object that DTO does not have
      forbidNonWhitelisted: true, // return error if passed data has unknown properties
      transform: true, // create and instance of DTO class using request data
    }),
  );
  await app.listen(3000);
}
bootstrap();
