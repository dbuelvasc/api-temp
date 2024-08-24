/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { CulturaGastronomicaRecetaController } from './cultura-gastronomica-receta.controller';
import { CulturaGastronomicaRecetaResolver } from './cultura-gastronomica-receta.resolver';

@Module({
  providers: [CulturaGastronomicaRecetaService, CulturaGastronomicaRecetaResolver],
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, RecetaEntity])],
  controllers: [CulturaGastronomicaRecetaController],
})
export class CulturaGastronomicaRecetaModule {}

