/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as sqliteStore from 'cache-manager-sqlite';

import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CulturaGastronomicaRestauranteResolver } from './cultura-gastronomica-restaurante.resolver';

@Module({
  providers: [CulturaGastronomicaRestauranteService, CulturaGastronomicaRestauranteResolver],
  imports: [
    TypeOrmModule.forFeature([CulturaGastronomicaEntity, RestauranteEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
})
export class CulturaGastronomicaRestauranteModule {}


