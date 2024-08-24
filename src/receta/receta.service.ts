import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class RecetaService {
  cacheKey = 'recetas';

  constructor(
    @InjectRepository(RecetaEntity)
    private readonly recetaRepository: Repository<RecetaEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<RecetaEntity[]> {
    const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const recetas: RecetaEntity[] = await this.recetaRepository.find({
        relations: ['culturaGastronomica'],
      });
      await this.cacheManager.set(this.cacheKey, recetas);
      return recetas;
    }
    return cached;
  }

  async findOne(id: number): Promise<RecetaEntity> {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
      relations: ['culturaGastronomica'],
    });
    if (!receta)
      throw new ExcepcionNegocio(
        'Receta no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return receta;
  }

  async create(receta: RecetaEntity): Promise<RecetaEntity> {
    return await this.recetaRepository.save(receta);
  }

  async update(id: number, receta: RecetaEntity): Promise<RecetaEntity> {
    const recetaPersistida: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!recetaPersistida)
      throw new ExcepcionNegocio(
        'Receta no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return await this.recetaRepository.save({
      ...recetaPersistida,
      ...receta,
    });
  }

  async delete(id: number) {
    const receta: RecetaEntity = await this.recetaRepository.findOne({
      where: { id },
    });
    if (!receta)
      throw new ExcepcionNegocio(
        'Receta no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    await this.recetaRepository.remove(receta);
  }
}
