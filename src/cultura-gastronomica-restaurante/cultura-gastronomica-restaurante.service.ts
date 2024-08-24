/* eslint-disable prettier/prettier */
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from './../restaurante/restaurante.entity';

@Injectable()
export class CulturaGastronomicaRestauranteService {
  cacheKey = 'culturas-gastronomicas-restaurante';
  constructor(
    @InjectRepository(CulturaGastronomicaEntity)
    private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,

    @InjectRepository(RestauranteEntity)
    private readonly restauranteRepository: Repository<RestauranteEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async agregarRestauranteCulturaGastronomica(
    idCultura: number,
    idRestaurante: number,
  ): Promise<CulturaGastronomicaEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: idRestaurante },
      });
    if (!restaurante)
      throw new ExcepcionNegocio(
        'El restaurante con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    const cultura: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: idCultura },
        relations: ['paises', 'productos', 'recetas', 'restaurantes'],
      });
    if (!cultura)
      throw new ExcepcionNegocio(
        'La cultura gastronómica con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    cultura.restaurantes = [...cultura.restaurantes, restaurante];
    return await this.culturaGastronomicaRepository.save(cultura);
  }

  async obtenerRestaurantesPorIdCulturaidRestaurante(
    idCultura: number,
    idRestaurante: number,
  ): Promise<RestauranteEntity> {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: idRestaurante },
      });
    if (!restaurante)
      throw new ExcepcionNegocio(
        'El restaurante con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    const cultura: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: idCultura },
        relations: ['restaurantes'],
      });
    if (!cultura)
      throw new ExcepcionNegocio(
        'La cultura gastronómica con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!culturaRestaurante)
      throw new ExcepcionNegocio(
        'El restaurante dado no está asociado a la cultura dada',
        ErrorNegocio.PRECONDITION_FAILED,
      );

    return culturaRestaurante;
  }

  async obtenerRestaurantesPorIdCultura(
    idCultura: number,
  ): Promise<RestauranteEntity[]> {
    const cacheKey = `${this.cacheKey}_${idCultura}`;
    const cached: RestauranteEntity[] = await this.cacheManager.get<
      RestauranteEntity[]
    >(cacheKey);

    if (!cached) {
      const cultura: CulturaGastronomicaEntity =
        await this.culturaGastronomicaRepository.findOne({
          where: { id: idCultura },
          relations: ['restaurantes'],
        });
      if (!cultura)
        throw new ExcepcionNegocio(
          'La cultura gastronómica con el id dado no existe',
          ErrorNegocio.NOT_FOUND,
        );

      await this.cacheManager.set(cacheKey, cultura.restaurantes);
      return cultura.restaurantes;
    }

    return cached;
  }

  async asociarRestaurantesCulturaGastronomica(
    idCultura: number,
    restaurantes: RestauranteEntity[],
  ): Promise<CulturaGastronomicaEntity> {
    const cultura: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: idCultura },
        relations: ['restaurantes'],
      });

    if (!cultura)
      throw new ExcepcionNegocio(
        'La cultura gastronómica con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    for (let i = 0; i < restaurantes.length; i++) {
      const restaurante: RestauranteEntity =
        await this.restauranteRepository.findOne({
          where: { id: restaurantes[i].id },
        });
      if (!restaurante)
        throw new ExcepcionNegocio(
          'El restaurante con el id dado no existe',
          ErrorNegocio.NOT_FOUND,
        );
    }

    cultura.restaurantes = restaurantes;
    return await this.culturaGastronomicaRepository.save(cultura);
  }

  async eliminarRestauranteCultura(idCultura: number, idRestaurante: number) {
    const restaurante: RestauranteEntity =
      await this.restauranteRepository.findOne({
        where: { id: idRestaurante },
      });
    if (!restaurante)
      throw new ExcepcionNegocio(
        'El restaurante con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    const cultura: CulturaGastronomicaEntity =
      await this.culturaGastronomicaRepository.findOne({
        where: { id: idCultura },
        relations: ['restaurantes'],
      });
    if (!cultura)
      throw new ExcepcionNegocio(
        'La cultura gastronómica con el id dado no existe',
        ErrorNegocio.NOT_FOUND,
      );

    const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(
      (e) => e.id === restaurante.id,
    );

    if (!culturaRestaurante)
      throw new ExcepcionNegocio(
        'El restaurante dado no está asociado a la cultura dada',
        ErrorNegocio.PRECONDITION_FAILED,
      );

    cultura.restaurantes = cultura.restaurantes.filter(
      (e) => e.id !== idRestaurante,
    );
    await this.culturaGastronomicaRepository.save(cultura);
  }
}