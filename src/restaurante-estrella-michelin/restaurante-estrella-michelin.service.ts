/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin.entity';

@Injectable()
export class RestauranteEstrellaMichelinService {
  cacheKey = 'restaurantes-estrella-michelin';

  constructor(
    @InjectRepository(RestauranteEstrellaMichelinEntity)
    private readonly estrellaMichelinRepository: Repository<RestauranteEstrellaMichelinEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async listarTodas(): Promise<RestauranteEstrellaMichelinEntity[]> {
    const cached: RestauranteEstrellaMichelinEntity[] = await this.cacheManager.get<
      RestauranteEstrellaMichelinEntity[]
    >(this.cacheKey);

    if (!cached) {
      const restaurantesEstrellaMichelin = await this.estrellaMichelinRepository.find({
        relations: ['restaurante'],
      });
      await this.cacheManager.set(this.cacheKey, restaurantesEstrellaMichelin);
      return restaurantesEstrellaMichelin;
    }

    return cached;
  }

  async obtenerPorId(id: number): Promise<RestauranteEstrellaMichelinEntity> {
    const estrellaMichelin = await this.estrellaMichelinRepository.findOne({
      where: { id },
      relations: ['restaurante'],
    });
    if (!estrellaMichelin) {
      throw new NotFoundException(`EstrellaMichelin with ID ${id} not found`);
    }
    return estrellaMichelin;
  }

  async crear(
    estrellaMichelinData: Partial<RestauranteEstrellaMichelinEntity>,
  ): Promise<RestauranteEstrellaMichelinEntity> {
    const nuevaEstrellaMichelin =
      this.estrellaMichelinRepository.create(estrellaMichelinData);
    return this.estrellaMichelinRepository.save(nuevaEstrellaMichelin);
  }

  async actualizar(
    id: number,
    estrellaMichelinData: Partial<RestauranteEstrellaMichelinEntity>,
  ): Promise<RestauranteEstrellaMichelinEntity> {
    const estrellaMichelin = await this.obtenerPorId(id);
    this.estrellaMichelinRepository.merge(
      estrellaMichelin,
      estrellaMichelinData,
    );
    return this.estrellaMichelinRepository.save(estrellaMichelin);
  }

  async eliminar(id: number): Promise<void> {
    const estrellaMichelin = await this.obtenerPorId(id);
    await this.estrellaMichelinRepository.remove(estrellaMichelin);
  }
}
