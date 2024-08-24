/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from '../pais/pais.entity';
import { PaisCulturaGastronomicaController } from './pais-cultura-gastronomica.controller';

@Module({
  providers: [PaisCulturaGastronomicaService]  ,
  imports: [TypeOrmModule.forFeature([CulturaGastronomicaEntity, PaisEntity])],
  controllers: [PaisCulturaGastronomicaController],
})
export class PaisCulturaGastronomicaModule {}




