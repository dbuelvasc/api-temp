/* eslint-disable prettier/prettier */
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from './../restaurante/restaurante.entity';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';


describe('CulturaGastronomicaRestauranteService', () => {
  let service: CulturaGastronomicaRestauranteService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let cultura: CulturaGastronomicaEntity;
  let listaRestaurantes: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaGastronomicaRestauranteService],
    }).compile();

    service = module.get<CulturaGastronomicaRestauranteService>(CulturaGastronomicaRestauranteService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    culturaGastronomicaRepository.clear();

    listaRestaurantes = [];
    for (let i = 0; i < 5; i++) {
      const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.location.country.name,
        ciudad: faker.location.city.name

      })
      listaRestaurantes.push(restaurante);
    }

    cultura = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurantes: listaRestaurantes
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Agregar un restaurante a una cultura', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    })

    const result: CulturaGastronomicaEntity = await service.agregarRestauranteCulturaGastronomica(nuevaCultura.id, nuevoRestaurante.id);

    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(nuevoRestaurante.nombre)

  });

  it('Lanzar error por un restaurante con id invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.agregarRestauranteCulturaGastronomica(nuevaCultura.id, -1)).rejects.toHaveProperty("mensaje", "El restaurante con el id dado no existe");
  });

  it('Lanzar error por una cultura con id invalido', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    await expect(() => service.agregarRestauranteCulturaGastronomica(-1, nuevoRestaurante.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Obtener un restaurante a partir de su id y el id de cultura', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    const restauranteGuardado: RestauranteEntity = await service.obtenerRestaurantesPorIdCulturaidRestaurante(cultura.id, restaurante.id,)
    expect(restauranteGuardado).not.toBeNull();
    expect(restauranteGuardado.nombre).toBe(restaurante.nombre);

  });

  it('Se intenta obtener un restaurante con un id invalido', async () => {
    await expect(() => service.obtenerRestaurantesPorIdCulturaidRestaurante(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El restaurante con el id dado no existe");
  });

  it('Se intenta obtener un restaurante con un id cultura invalido', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    await expect(() => service.obtenerRestaurantesPorIdCulturaidRestaurante(-1, restaurante.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se intenta obtener un restaurante que no se encuentra asociado a una cultura', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    await expect(() => service.obtenerRestaurantesPorIdCulturaidRestaurante(cultura.id, nuevoRestaurante.id)).rejects.toHaveProperty("mensaje", "El restaurante dado no está asociado a la cultura dada");
  });

  it('Se obtienen los restaurantes asociados a una cultura', async () => {
    const restaurantes: RestauranteEntity[] = await service.obtenerRestaurantesPorIdCultura(cultura.id);
    expect(restaurantes.length).toBe(5)
  });

  it('Se obtienen los restaurantes asociados a una cultura invalida', async () => {
    await expect(() => service.obtenerRestaurantesPorIdCultura(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de restaurantes asociados a una cultura', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    const culturaActualizada: CulturaGastronomicaEntity = await service.asociarRestaurantesCulturaGastronomica(cultura.id, [nuevoRestaurante]);
    expect(culturaActualizada.restaurantes.length).toBe(1);
    expect(culturaActualizada.restaurantes[0].nombre).toBe(nuevoRestaurante.nombre);

  });

  it('Se actualiza la lista de restaurantes asociados a una cultura invalida', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    await expect(() => service.asociarRestaurantesCulturaGastronomica(-1, [nuevoRestaurante])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de restaurantes asociados a una cultura con restaurantes invalidos', async () => {
    const nuevoRestaurante: RestauranteEntity = listaRestaurantes[0];
    nuevoRestaurante.id = -1;

    await expect(() => service.asociarRestaurantesCulturaGastronomica(cultura.id, [nuevoRestaurante])).rejects.toHaveProperty("mensaje", "El restaurante con el id dado no existe");
  });

  it('Se elimina un restaurante de una cultura', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];

    await service.eliminarRestauranteCultura(cultura.id, restaurante.id);

    const culturaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({ where: { id: cultura.id }, relations: ["restaurantes"] });
    const restauranteEliminado: RestauranteEntity = culturaAlmacenada.restaurantes.find(a => a.id === restaurante.id);

    expect(restauranteEliminado).toBeUndefined();

  });

  it('Se elimina un restaurante invalido de una cultura', async () => {
    await expect(() => service.eliminarRestauranteCultura(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El restaurante con el id dado no existe");
  });

  it('Se elimina un restaurante de una cultura invalida', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    await expect(() => service.eliminarRestauranteCultura(-1, restaurante.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se elimina un restaurante no asociado a una cultura', async () => {
    const nuevoRestaurante: RestauranteEntity = await restauranteRepository.save({
      nombre: faker.location.country.name,
      ciudad: faker.location.city.name
    });

    await expect(() => service.eliminarRestauranteCultura(cultura.id, nuevoRestaurante.id)).rejects.toHaveProperty("mensaje", "El restaurante dado no está asociado a la cultura dada");
  });

});
