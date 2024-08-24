/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/utilidades/configuracion-test';

import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from './../pais/pais.entity';


describe('PaisCulturaGastronomicaService', () => {
  let service: PaisCulturaGastronomicaService;
  let culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>;
  let paisRepository: Repository<PaisEntity>;
  let pais: PaisEntity;
  let listaCulturas: CulturaGastronomicaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCulturaGastronomicaService],
    }).compile();

    service = module.get<PaisCulturaGastronomicaService>(PaisCulturaGastronomicaService);
    culturaGastronomicaRepository = module.get<Repository<CulturaGastronomicaEntity>>(getRepositoryToken(CulturaGastronomicaEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    culturaGastronomicaRepository.clear();

    listaCulturas = [];
    for (let i = 0; i < 5; i++) {
      const cultura: CulturaGastronomicaEntity = await culturaGastronomicaRepository.save({
        nombre: faker.company.name(),
        descripcion: faker.lorem.sentence(),
      })
      listaCulturas.push(cultura);
    }

    pais = await paisRepository.save({
      nombre: faker.location.country.name,
      culturasGastronomicas: listaCulturas
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  it('Se obtienen los paises asociados a una cultura', async () => {
    const culturas: CulturaGastronomicaEntity[] = await service.obtenerCulturasPorIdPais(pais.id);
    expect(culturas.length).toBe(5)
  });

  it('Se obtienen los paises asociados a una cultura invalida', async () => {
    await expect(() => service.obtenerCulturasPorIdPais(-1)).rejects.toHaveProperty("mensaje", "El país con el id dado no existe");
  });
});
