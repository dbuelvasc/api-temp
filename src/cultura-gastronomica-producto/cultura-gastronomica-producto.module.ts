/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaGastronomicaProductoController } from './cultura-gastronomica-producto.controller';
import { CulturaGastronomicaProductoResolver } from './cultura-gastronomica-producto.resolver';

@Module({
  providers: [CulturaGastronomicaProductoService, CulturaGastronomicaProductoResolver],
  imports: [TypeOrmModule.forFeature([ProductoEntity, CulturaGastronomicaEntity])],
  controllers: [CulturaGastronomicaProductoController],
})
export class CulturaGastronomicaProductoModule {}