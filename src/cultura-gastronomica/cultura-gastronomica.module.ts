/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaController } from './cultura-gastronomica.controller';
import { CulturaGastronomicaResolver } from './cultura-gastronomica.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [CulturaGastronomicaService, CulturaGastronomicaEntity, CulturaGastronomicaResolver],
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity]),
  CacheModule.register({
    store: sqliteStore,
    options: {
      ttl: 30
    },
    path: ':memory:',
  })],
  exports: [CulturaGastronomicaEntity, TypeOrmModule.forFeature([CulturaGastronomicaEntity])],
  controllers: [CulturaGastronomicaController]
})
export class CulturaGastronomicaModule { }


