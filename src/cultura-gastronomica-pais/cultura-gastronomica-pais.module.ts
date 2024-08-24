/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaPaisController } from './cultura-gastronomica-pais.controller';
import { CulturaGastronomicaPaisResolver } from './cultura-gastronomica-pais.resolver';

@Module({
  providers: [CulturaGastronomicaPaisService, CulturaGastronomicaPaisResolver],
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, PaisEntity])],
  controllers: [CulturaGastronomicaPaisController],
})
export class CulturaGastronomicaPaisModule {}