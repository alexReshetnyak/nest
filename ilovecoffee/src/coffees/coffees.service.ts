import { Injectable, NotFoundException } from '@nestjs/common';

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
    const coffee = this.coffees.find((coffee) => coffee.id === id);

    if (!coffee) {
      throw new NotFoundException(`Coffee with id ${id} not found`);
    }

    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
    return createCoffeeDto;
  }

  update(id: number, updateCoffeeDto: any) {
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
