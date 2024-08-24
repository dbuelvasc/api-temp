/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let listaRestaurantes: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(
      getRepositoryToken(RestauranteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaRestaurantes = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
      });
      listaRestaurantes.push(restaurante);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Obtener todos los restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.listarTodos();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(listaRestaurantes.length);
  });

  it('Obtener restaurante por id', async () => {
    const restauranteGuardado: RestauranteEntity = listaRestaurantes[0];
    const restaurante: RestauranteEntity = await service.obtenerPorId(
      restauranteGuardado.id,
    );
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(restauranteGuardado.nombre);
    expect(restaurante.ciudad).toEqual(restauranteGuardado.ciudad);
  });

  it('Obtener restaurante con id invalido', async () => {
    await expect(service.obtenerPorId(-1)).rejects.toThrow();
  });

  it('Crear un restaurante', async () => {
    const restauranteData = {
      nombre: faker.company.name(),
      ciudad: faker.location.city(),
    };

    const nuevoRestaurante: RestauranteEntity = await service.crear(
      restauranteData,
    );

    expect(nuevoRestaurante).not.toBeNull();
    expect(nuevoRestaurante.id).toBeDefined();
    expect(nuevoRestaurante.nombre).toEqual(restauranteData.nombre);
    expect(nuevoRestaurante.ciudad).toEqual(restauranteData.ciudad);
  });


  it('Actualizar un restaurante', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    restaurante.nombre = `${faker.company.name()} NEW`;
    restaurante.ciudad = `${faker.location.city()} NEW`;

    const restauranteActualizado: RestauranteEntity = await service.actualizar(
      restaurante.id,
      restaurante,
    );
    expect(restauranteActualizado).not.toBeNull();
    expect(restauranteActualizado.nombre).toEqual(restaurante.nombre);
    expect(restauranteActualizado.ciudad).toEqual(restaurante.ciudad);
  });

  it('Actualizar un restaurante con id invalido', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    restaurante.nombre = `${faker.company.name()} UPDATED`;
    restaurante.ciudad = `${faker.location.city()} UPDATED`;

    await expect(service.actualizar(-1, restaurante)).rejects.toThrow();
  });

  it('Eliminar un restaurante', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    await service.eliminar(restaurante.id);

    const restauranteEliminado: RestauranteEntity = await repository.findOne({
      where: { id: restaurante.id },
    });
    expect(restauranteEliminado).toBeNull();
  });

  it('Eliminar un restaurante con id invalido', async () => {
    await expect(service.eliminar(-1)).rejects.toThrow();
  });

});
