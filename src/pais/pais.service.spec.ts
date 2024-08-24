/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { faker } from '@faker-js/faker';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let countriesList: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(
      getRepositoryToken(PaisEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const country: PaisEntity = await repository.save({
        nombre: faker.location.country(),
        culturasGastronomicas: []
      });
      countriesList.push(country);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all countries', async () => {
    const countries: PaisEntity[] = await service.findAll();
    expect(countries).not.toBeNull();
    expect(countries).toHaveLength(countriesList.length);
  });

  it('findOne should return a country by id', async () => {
    const storedCountry: PaisEntity = countriesList[0];
    const country: PaisEntity = await service.findOne(storedCountry.id);
    expect(country).not.toBeNull();
    expect(country.nombre).toEqual(storedCountry.nombre);
  });

  it('findOne should throw an exception for an invalid country', async () => {
    await expect(() => service.findOne(0)).rejects.toHaveProperty(
      'mensaje',
      'País no encontrado',
    );
  });

  it('create should return a new country', async () => {
    const country: PaisEntity = {
      id: 0,
      nombre: faker.location.country(),
      culturasGastronomicas: []
      
    };

    const newCountry: PaisEntity = await service.create(country);
    expect(newCountry).not.toBeNull();

    const storedCountry: PaisEntity = await repository.findOne({
      where: { id: newCountry.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.nombre).toEqual(newCountry.nombre);
  });

  it('update should modify a country', async () => {
    const country: PaisEntity = countriesList[0];
    country.nombre = 'Wonderland';
    const updatedCountry: PaisEntity = await service.update(
      country.id,
      country,
    );
    expect(updatedCountry).not.toBeNull();
    const storedCountry: PaisEntity = await repository.findOne({
      where: { id: country.id },
    });
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.nombre).toEqual(country.nombre);
  });

  it('update should throw an exception for an invalid country', async () => {
    let country: PaisEntity = countriesList[0];
    country = {
      ...country,
      nombre: 'Wonderland 2',
    };
    await expect(() => service.update(0, country)).rejects.toHaveProperty(
      'mensaje',
      'País no encontrado',
    );
  });

  it('delete should remove a country', async () => {
    const country: PaisEntity = countriesList[0];
    await service.delete(country.id);
    const deletedCountry: PaisEntity = await repository.findOne({
      where: { id: country.id },
    });
    expect(deletedCountry).toBeNull();
  });

  it('delete should throw an exception for an invalid country', async () => {
    await expect(() => service.delete(0)).rejects.toHaveProperty(
      'mensaje',
      'País no encontrado',
    );
  });
});
