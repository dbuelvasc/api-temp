/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin.entity';
import { RestauranteEstrellaMichelinService } from './restaurante-estrella-michelin.service';

describe('RestauranteEstrellaMichelinService', () => {
  let service: RestauranteEstrellaMichelinService;
  let estrellaMichelinRepository: Repository<RestauranteEstrellaMichelinEntity>;
  let listaEstrellasMichelin: RestauranteEstrellaMichelinEntity[];
  let restauranteRepository: Repository<RestauranteEntity>;
  let listaRestaurantes: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [RestauranteEstrellaMichelinService],
    }).compile();

    service = module.get<RestauranteEstrellaMichelinService>(RestauranteEstrellaMichelinService);
    estrellaMichelinRepository = module.get<Repository<RestauranteEstrellaMichelinEntity>>(getRepositoryToken(RestauranteEstrellaMichelinEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    estrellaMichelinRepository.clear();

    listaRestaurantes = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.location.country(),
        ciudad: faker.location.city(),
      });
      listaRestaurantes.push(restaurante);
    }

    listaEstrellasMichelin = [];
    for (const restaurante of listaRestaurantes) {
      const estrellaMichelin: RestauranteEstrellaMichelinEntity =
        await estrellaMichelinRepository.save({
          fechaConsecucion: faker.date.past(),
          restaurante: restaurante,
        });
      listaEstrellasMichelin.push(estrellaMichelin);
    }
  };


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Obtener todas las estrellas Michelin', async () => {
    const estrellasMichelin: RestauranteEstrellaMichelinEntity[] =
      await service.listarTodas();
    expect(estrellasMichelin).not.toBeNull();
    expect(estrellasMichelin).toHaveLength(listaEstrellasMichelin.length);
  });

  it('Obtener estrella Michelin por id', async () => {
    const estrellaMichelinGuardada: RestauranteEstrellaMichelinEntity =
      listaEstrellasMichelin[0];
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = await service.obtenerPorId(
      estrellaMichelinGuardada.id,
    );
    expect(estrellaMichelin).not.toBeNull();
    expect(estrellaMichelin.restaurante).toEqual(estrellaMichelinGuardada.restaurante);
  });

  it('Obtener estrella Michelin con id invalido', async () => {
    await expect(service.obtenerPorId(-1)).rejects.toThrow();
  });

  it('Crear una estrella Michelin para un restaurante', async () => {
    const nuevoRestaurante: RestauranteEntity =
      await restauranteRepository.save({
        nombre: faker.company.name(),
        ciudad: faker.location.city(),
      });

    const estrellaMichelinData = {
      fechaConsecucion: faker.date.past(),
      restaurante: nuevoRestaurante,
    };

    const nuevaEstrellaMichelin: RestauranteEstrellaMichelinEntity = await service.crear(
      estrellaMichelinData,
    );

    expect(nuevaEstrellaMichelin).not.toBeNull();
    expect(nuevaEstrellaMichelin.id).toBeDefined();
    expect(
      nuevaEstrellaMichelin.fechaConsecucion,
    ).toEqual(estrellaMichelinData.fechaConsecucion);
  });


  it('Actualizar una estrella Michelin', async () => {
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = listaEstrellasMichelin[0];
    const fechaConsecucionOriginal = estrellaMichelin.fechaConsecucion;
    estrellaMichelin.fechaConsecucion = faker.date.recent();

    const estrellaMichelinActualizada: RestauranteEstrellaMichelinEntity =
      await service.actualizar(estrellaMichelin.id, {
        fechaConsecucion: estrellaMichelin.fechaConsecucion,
      });

    const updatedDateString = estrellaMichelin.fechaConsecucion
      .toISOString()
      .split('T')[0];
    const dbDateString = estrellaMichelinActualizada.fechaConsecucion
      .toISOString()
      .split('T')[0];

    expect(updatedDateString).not.toEqual(fechaConsecucionOriginal);
    expect(dbDateString).toEqual(updatedDateString);
  });

  it('Actualizar una estrella Michelin con id invalido', async () => {
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = listaEstrellasMichelin[0];
    estrellaMichelin.fechaConsecucion = faker.date.future();

    await expect(service.actualizar(-1, estrellaMichelin)).rejects.toThrow();
  });

  it('Eliminar una estrella Michelin', async () => {
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = listaEstrellasMichelin[0];
    await service.eliminar(estrellaMichelin.id);

    const estrellaMichelinEliminada: RestauranteEstrellaMichelinEntity =
      await estrellaMichelinRepository.findOne({ where: { id: estrellaMichelin.id } });
    expect(estrellaMichelinEliminada).toBeNull();
  });

  it('Eliminar una estrella Michelin con id invalido', async () => {
    await expect(service.eliminar(-1)).rejects.toThrow();
  });
});
