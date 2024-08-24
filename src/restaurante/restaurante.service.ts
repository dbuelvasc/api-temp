/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { RestauranteEntity } from './restaurante.entity';

@Injectable()
export class RestauranteService {
  
  cacheKey = 'restaurantes';

  constructor(
    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async listarTodos(): Promise<RestauranteEntity[]> {
    const cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(this.cacheKey);

    if (!cached) {
      const restaurantes = await this.restauranteRepository.find({
        relations: ['culturaGastronomica'],
      });
      await this.cacheManager.set(this.cacheKey, restaurantes);
      return restaurantes;
    }

    return cached;
  }

  async obtenerPorId(id: number): Promise<RestauranteEntity> {
    const restaurante = await this.restauranteRepository.findOne({
      where: { id },
      relations: ['culturaGastronomica'],
    });
    if (!restaurante) {
      throw new NotFoundException(`Restaurante with ID ${id} not found`);
    }
    return restaurante;
  }

  async crear(
    restauranteData: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const nuevoRestaurante = this.restauranteRepository.create(restauranteData);
    return this.restauranteRepository.save(nuevoRestaurante);
  }

  async actualizar(
    id: number,
    restauranteData: Partial<RestauranteEntity>,
  ): Promise<RestauranteEntity> {
    const restaurante = await this.obtenerPorId(id);
    this.restauranteRepository.merge(restaurante, restauranteData);
    return this.restauranteRepository.save(restaurante);
  }

  async eliminar(id: number): Promise<void> {
    const restaurante = await this.obtenerPorId(id);
    await this.restauranteRepository.remove(restaurante);
  }
}
