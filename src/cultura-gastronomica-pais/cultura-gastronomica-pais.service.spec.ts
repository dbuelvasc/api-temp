/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';

import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from './../pais/pais.entity';


describe('CulturaGastronomicaPaisService', () => {
  let service: CulturaGastronomicaPaisService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let cultura: CulturaGastronomicaEntity;
  let listaPaises: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaGastronomicaPaisService],
    }).compile();

    service = module.get<CulturaGastronomicaPaisService>(CulturaGastronomicaPaisService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaGastronomicaRepository.clear();

    listaPaises = [];
    for (let i = 0; i < 5; i++) {
      const pais: PaisEntity = await paisRepository.save({
        nombre: faker.location.country.name,
        descripcion :  faker.lorem.sentence()
      })
      listaPaises.push(pais);
    }

    cultura = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      paises: listaPaises
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Agregar una pais a una cultura', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
    })

    const result: CulturaGastronomicaEntity = await service.agregarPaisCulturaGastronomica(nuevaCultura.id, nuevoPais.id);

    expect(result.paises.length).toBe(1);
    expect(result.paises[0]).not.toBeNull();
    expect(result.paises[0].nombre).toBe(nuevoPais.nombre)

  });

  it('Lanzar error por un pais con id invalido', async () => {
    const nuevaCultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence()
    })

    await expect(() => service.agregarPaisCulturaGastronomica(nuevaCultura.id, -1)).rejects.toHaveProperty("mensaje", "El país con el id dado no existe");
  });

  it('Lanzar error por una cultura con id invalido', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    await expect(() => service.agregarPaisCulturaGastronomica(-1, nuevoPais.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Obtener un pais a partir de su id y el id de cultura', async () => {
    const pais: PaisEntity = listaPaises[0];
    const paisGuardado: PaisEntity = await service.obtenerPaisesPorIdCulturaIdPais(cultura.id, pais.id,)
    expect(paisGuardado).not.toBeNull();
    expect(paisGuardado.nombre).toBe(pais.nombre);

  });

  it('Se intenta obtener un pais con un id invalido', async () => {
    await expect(() => service.obtenerPaisesPorIdCulturaIdPais(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El país con el id dado no existe");
  });

  it('Se intenta obtener un pais con un id cultura invalido', async () => {
    const pais: PaisEntity = listaPaises[0];
    await expect(() => service.obtenerPaisesPorIdCulturaIdPais(-1, pais.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se intenta obtener un pais que no se encuentra asociado a una cultura', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    await expect(() => service.obtenerPaisesPorIdCulturaIdPais(cultura.id, nuevoPais.id)).rejects.toHaveProperty("mensaje", "El país dado no está asociado a la cultura dada");
  });

  it('Se obtienen los paises asociados a una cultura', async () => {
    const paises: PaisEntity[] = await service.obtenerPaisesPorIdCultura(cultura.id);
    expect(paises.length).toBe(5)
  });

  it('Se obtienen los paises asociados a una cultura invalida', async () => {
    await expect(() => service.obtenerPaisesPorIdCultura(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de paises asociados a una cultura', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    const culturaActualizada: CulturaGastronomicaEntity = await service.asociarPaisesCulturaGastronomica(cultura.id, [nuevoPais]);
    expect(culturaActualizada.paises.length).toBe(1);
    expect(culturaActualizada.paises[0].nombre).toBe(nuevoPais.nombre);

  });

  it('Se actualiza la lista de paises asociados a una cultura invalida', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    await expect(() => service.asociarPaisesCulturaGastronomica(-1, [nuevoPais])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se actualiza la lista de paises asociados a una cultura con paises invalidos', async () => {
    const nuevoPais: PaisEntity = listaPaises[0];
    nuevoPais.id = -1;

    await expect(() => service.asociarPaisesCulturaGastronomica(cultura.id, [nuevoPais])).rejects.toHaveProperty("mensaje", "El país con el id dado no existe");
  });

  it('Se elimina un pais de una cultura', async () => {
    const pais: PaisEntity = listaPaises[0];

    await service.eliminarPaisCultura(cultura.id, pais.id);

    const culturaAlmacenada: CulturaGastronomicaEntity = await culturaGastronomicaRepository.findOne({ where: { id: cultura.id }, relations: ["paises"] });
    const paisEliminado: PaisEntity = culturaAlmacenada.paises.find(a => a.id === pais.id);

    expect(paisEliminado).toBeUndefined();

  });

  it('Se elimina un pais invalido de una cultura', async () => {
    await expect(() => service.eliminarPaisCultura(cultura.id, -1)).rejects.toHaveProperty("mensaje", "El país con el id dado no existe");
  });

  it('Se elimina un pais de una cultura invalida', async () => {
    const pais: PaisEntity = listaPaises[0];
    await expect(() => service.eliminarPaisCultura(-1, pais.id)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe");
  });

  it('Se elimina un pais no asociado a una cultura', async () => {
    const nuevoPais: PaisEntity = await paisRepository.save({
      nombre: faker.location.country.name
    });

    await expect(() => service.eliminarPaisCultura(cultura.id, nuevoPais.id)).rejects.toHaveProperty("mensaje", "El país dado no está asociado a la cultura dada");
  });

});
