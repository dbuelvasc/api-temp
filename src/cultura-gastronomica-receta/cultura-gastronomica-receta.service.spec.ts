/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';

import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from './../receta/receta.entity';


describe('CulturaGastronomicaRecetaService', () => {
  let service: CulturaGastronomicaRecetaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let recetaRepository: Repository<RecetaEntity>;
  let cultura: CulturaGastronomicaEntity;
  let listaRecetas: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaRecetaService],
    }).compile();

    service = module.get<CulturaGastronomicaRecetaService>(CulturaGastronomicaRecetaService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recetaRepository.clear();
    culturaGastronomicaRepository.clear();

    listaRecetas = [];
    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.location.country.name,
        descripcion: faker.lorem.sentence(),
        urlFoto : faker.internet.url(),
        videoPreparacion: faker.internet.url(),
        procesoPreparacion: faker.lorem.sentence()
      })
      listaRecetas.push(receta);
    }

    cultura = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      recetas: listaRecetas
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Agregar un receta a una cultura', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    })

    const result: CulturaGastronomicaEntity = await service.agregarRecetaCulturaGastronomica(nuevaCultura.id, nuevaReceta.id);

    expect(result.recetas.length).toBe(1);
    expect(result.recetas[0]).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(nuevaReceta.nombre)

  });

  it('Lanzar error por un receta con id invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.agregarRecetaCulturaGastronomica(nuevaCultura.id, -1)).rejects.toHaveProperty("mensaje", "La receta con el id dado no existe");
  });

  it('Lanzar error por una cultura con id invalido', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    await expect(() => service.agregarRecetaCulturaGastronomica(-1, nuevaReceta.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Obtener un receta a partir de su id y el id de cultura', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    const recetaGuardado: RecetaEntity = await service.obtenerRecetasPorIdCulturaidReceta(cultura.id, receta.id,)
    expect(recetaGuardado).not.toBeNull();
    expect(recetaGuardado.nombre).toBe(receta.nombre);

  });

  it('Se intenta obtener un receta con un id invalido', async () => {
    await expect(() => service.obtenerRecetasPorIdCulturaidReceta(cultura.id, -1)).rejects.toHaveProperty("mensaje", "La receta con el id dado no existe");
  });

  it('Se intenta obtener un receta con un id cultura invalido', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    await expect(() => service.obtenerRecetasPorIdCulturaidReceta(-1, receta.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se intenta obtener un receta que no se encuentra asociado a una cultura', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    await expect(() => service.obtenerRecetasPorIdCulturaidReceta(cultura.id, nuevaReceta.id)).rejects.toHaveProperty("mensaje", "La receta dada no está asociado a la cultura dada");
  });

  it('Se obtienen los recetas asociados a una cultura', async () => {
    const recetas: RecetaEntity[] = await service.obtenerRecetasPorIdCultura(cultura.id);
    expect(recetas.length).toBe(5)
  });

  it('Se obtienen los recetas asociados a una cultura invalida', async () => {
    await expect(() => service.obtenerRecetasPorIdCultura(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de recetas asociados a una cultura', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    const culturaActualizada: CulturaGastronomicaEntity = await service.asociarRecetasCulturaGastronomica(cultura.id, [nuevaReceta]);
    expect(culturaActualizada.recetas.length).toBe(1);
    expect(culturaActualizada.recetas[0].nombre).toBe(nuevaReceta.nombre);

  });

  it('Se actualiza la lista de recetas asociados a una cultura invalida', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    await expect(() => service.asociarRecetasCulturaGastronomica(-1, [nuevaReceta])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de recetas asociados a una cultura con recetas invalidos', async () => {
    const nuevaReceta: RecetaEntity = listaRecetas[0];
    nuevaReceta.id = -1;

    await expect(() => service.asociarRecetasCulturaGastronomica(cultura.id, [nuevaReceta])).rejects.toHaveProperty("mensaje", "La receta con el id dado no existe");
  });

  it('Se elimina un receta de una cultura', async () => {
    const receta: RecetaEntity = listaRecetas[0];

    await service.eliminarRecetaCultura(cultura.id, receta.id);

    const culturaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({ where: { id: cultura.id }, relations: ["recetas"] });
    const recetaEliminado: RecetaEntity = culturaAlmacenada.recetas.find(a => a.id === receta.id);

    expect(recetaEliminado).toBeUndefined();

  });

  it('Se elimina un receta invalido de una cultura', async () => {
    await expect(() => service.eliminarRecetaCultura(cultura.id, -1)).rejects.toHaveProperty("mensaje", "La receta con el id dado no existe");
  });

  it('Se elimina un receta de una cultura invalida', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    await expect(() => service.eliminarRecetaCultura(-1, receta.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se elimina un receta nmo asociado a una cultura', async () => {
    const nuevaReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.location.country.name,
      descripcion: faker.lorem.sentence(),
      urlFoto : faker.internet.url(),
      videoPreparacion: faker.internet.url(),
      procesoPreparacion: faker.lorem.sentence()
    });

    await expect(() => service.eliminarRecetaCultura(cultura.id, nuevaReceta.id)).rejects.toHaveProperty("mensaje", "La receta dada no está asociado a la cultura dada");
  });

});
