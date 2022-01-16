import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove any property from body object that DTO does not have
      transform: true, // create and instance of DTO class using request data
      forbidNonWhitelisted: true, // return error if passed data has unknown properties
      transformOptions: {
        enableImplicitConversion: true, // automatically adds @Type decorators in dto
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
