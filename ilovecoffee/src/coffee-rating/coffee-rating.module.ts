import { Module } from '@nestjs/common';

// import { DatabaseModule } from './../database/database.module';
import { CoffeeRatingService } from './coffee-rating.service';
import { CoffeesModule } from './../coffees/coffees.module';

@Module({
  imports: [
    CoffeesModule,
    // * Register dynamic module
    // DatabaseModule.register({
    //   type: 'postgres',
    //   host: 'localhost',
    //   password: 'password',
    //   port: 5432,
    // }),
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
