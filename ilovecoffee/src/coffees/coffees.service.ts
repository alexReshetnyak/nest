import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ConfigService, ConfigType } from '@nestjs/config';

import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Event } from './../events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { COFFEE_BRANDS } from './coffee.constants';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import coffeesConfig from './config/coffees.config';

// @Injectable({ scope: Scope.REQUEST }) // New instance for each request
// @Injectable({ scope: Scope.TRANSIENT }) // New instance creates for every use
@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    // * Injected coffee brands from db
    console.log('Injected brands: ', coffeeBrands);
    const databaseHost = this.configService.get(
      // 'DATABASE_HOST',
      'database.host',
      'localhost',
    );

    const configCoffees = this.configService.get('coffees');
    console.log(
      'DATABASE_HOST: ',
      databaseHost,
      'config Coffees: ',
      configCoffees,
      'Coffees config (recommended way to use): ',
      this.coffeesConfiguration,
    );
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;

    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee with id ${id} not found`);
    }

    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    // find and update
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }

    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  // ! Transaction example
  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();

      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });

    if (existingFlavor) {
      return existingFlavor;
    }

    return this.flavorRepository.create({ name });
  }
}
