import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';

import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constants';

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  exports: [CoffeesService],
  controllers: [CoffeesController],
  // providers: [CoffeesService],
  providers: [
    CoffeesService,
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (brandsFactory: CoffeeBrandsFactory) => {
    //     return brandsFactory.create();
    //   },
    //   inject: [CoffeeBrandsFactory],
    // },

    // * RESOLVER
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        return coffeeBrands;
      },
      inject: [Connection],
    },
  ],
})
export class CoffeesModule {}
