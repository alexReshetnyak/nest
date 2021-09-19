import { Injectable } from '@nestjs/common';

import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    { id: 1, name: 'test', brand: 'test', flavors: ['test'] },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: number) {
    return this.coffees.find((coffee) => coffee.id === id);
  }

  create(coffee: any) {
    this.coffees.push(coffee);
  }

  update(id: number, coffee: any) {
    const existingCoffee = this.findOne(id);

    if (existingCoffee) {
      // update
    }
  }

  remove(id: number) {
    const index = this.coffees.findIndex((c) => c.id === id);

    if (~index) {
      this.coffees.splice(index, 1);
    }
  }
}
