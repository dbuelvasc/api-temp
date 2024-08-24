/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/common';


describe('CulturaGastronomicaService', () => {
  let service: CulturaGastronomicaService;
  let repository: Repository<CulturaGastronomicaEntity>;
  let listaCulturas: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [CulturaGastronomicaService],
    }).compile();

    service = module.get<CulturaGastronomicaService>(CulturaGastronomicaService);
    repository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    listaCulturas = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaGastronomicaEntity = await repository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence()
      })
      listaCulturas.push(cultura);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('Obtener todas las culturas', async () => {
    const culturas: CulturaGastronomicaEntity[] = await service.findAll();
    expect(culturas).not.toBeNull();
    expect(culturas).toHaveLength(listaCulturas.length);
  });

  it('Obtener cultura por id', async () => {
    const culturaGuardada: CulturaGastronomicaEntity = listaCulturas[0];
    const cultura: CulturaGastronomicaEntity = await service.findOne(culturaGuardada.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(culturaGuardada.nombre)
    expect(cultura.descripcion).toEqual(culturaGuardada.descripcion)

  });

  it('Obtener una cultura con id invalido', async () => {
    await expect(() => service.findOne(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe")
  });

  it('Crear una cultura', async () => {
    const cultura: CulturaGastronomicaEntity = {
      id: 0,
      nombre: faker.company.name(),
      descripcion: faker.lorem.sentence(),
      restaurantes: [],
      paises: [],
      productos: [],
      recetas: []
    }

    const nuevaCultura: CulturaGastronomicaEntity = await service.create(cultura);
    expect(nuevaCultura).not.toBeNull();

    const storedMuseum: CulturaGastronomicaEntity = await repository.findOne({ where: { id: nuevaCultura.id } })
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.nombre).toEqual(nuevaCultura.nombre)
    expect(storedMuseum.descripcion).toEqual(nuevaCultura.descripcion)
  });

  it('Actualizar una cultura', async () => {
    const cultura: CulturaGastronomicaEntity = listaCulturas[0];
    cultura.nombre = "Nuevo nombre";

    const culturaActualizada: CulturaGastronomicaEntity = await service.update(cultura.id, cultura);
    expect(culturaActualizada).not.toBeNull();

    const storedMuseum: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.nombre).toEqual(cultura.nombre)
  });

  it('Actualizar una cultura con id invalido', async () => {
    let cultura: CulturaGastronomicaEntity = listaCulturas[0];
    cultura = {
      ...cultura, nombre: "Nuevo nombre", descripcion: "Nueva descripcion"
    }
    await expect(() => service.update(-1, cultura)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe")
  });

  it('Eliminar una cultura', async () => {
    const cultura: CulturaGastronomicaEntity = listaCulturas[0];
    await service.delete(cultura.id);

    const culturaEliminada: CulturaGastronomicaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(culturaEliminada).toBeNull();
  });

  it('Eliminar una cultura con id invalido', async () => {
    const cultura: CulturaGastronomicaEntity = listaCulturas[0];
    await service.delete(cultura.id);
    await expect(() => service.delete(-1)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el id dado no existe")
  });

});



