import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new TimeoutInterceptor(),
  );

  const options = new DocumentBuilder()
    .setTitle('ILoveCoffee')
    .setDescription('Coffee application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
