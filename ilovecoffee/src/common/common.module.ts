import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { LoggingMiddleware } from './middleware/logging.middleware';
import { ApiKeyGuard } from './guard/api-key.guard';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
    // .forRoutes({ path: 'coffees', method: RequestMethod.GET });
    // exclude('coffees').forRoutes('*');
  }
}
