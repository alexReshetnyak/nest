import { ConfigService } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiKeyGuard } from './api-key.guard';

describe('ApiKeyGuard', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: APP_GUARD, useClass: ApiKeyGuard },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(new ApiKeyGuard(new Reflector(), configService)).toBeDefined();
  });
});
