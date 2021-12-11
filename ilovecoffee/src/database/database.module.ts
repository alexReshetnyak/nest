import { DynamicModule, Module } from '@nestjs/common';
import { ConnectionOptions, createConnection } from 'typeorm';

// * STATIC IMPLEMENTATION
// @Module(
//   {
//   providers: [
//     {
//       provide: 'CONNECTION',
//       useValue: createConnection({
//         type: 'postgres',
//         host: 'localhost',
//         port: 5432,
//       }),
//     },
//   ],
// }
// )
// export class DatabaseModule {}

// * Dynamic IMPLEMENTATION
@Module({})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        },
      ],
    };
  }
}
