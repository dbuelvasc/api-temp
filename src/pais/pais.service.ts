/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class PaisService {
  cacheKey = 'paises';

  constructor(
    @InjectRepository(PaisEntity)
    private readonly paisRepository: Repository<PaisEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<PaisEntity[]> {
    const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const paises: PaisEntity[] = await this.paisRepository.find({
        relations: ['culturasGastronomicas'],
      });
      await this.cacheManager.set(this.cacheKey, paises);
      return paises;
    }
    return cached;
  }

  async findOne(id: number): Promise<PaisEntity> {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
      relations: ['culturasGastronomicas'],
    });
    if (!pais)
      throw new ExcepcionNegocio('País no encontrado', ErrorNegocio.NOT_FOUND);

    return pais;
  }

  async create(pais: PaisEntity): Promise<PaisEntity> {
    return await this.paisRepository.save(pais);
  }

  async update(id: number, pais: PaisEntity): Promise<PaisEntity> {
    const paisPersistido: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!paisPersistido)
      throw new ExcepcionNegocio('País no encontrado', ErrorNegocio.NOT_FOUND);

    return await this.paisRepository.save({
      ...paisPersistido,
      ...pais,
    });
  }

  async delete(id: number) {
    const pais: PaisEntity = await this.paisRepository.findOne({
      where: { id },
    });
    if (!pais)
      throw new ExcepcionNegocio('País no encontrado', ErrorNegocio.NOT_FOUND);

    await this.paisRepository.remove(pais);
  }
}
