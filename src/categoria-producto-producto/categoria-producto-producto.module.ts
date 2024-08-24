/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriaProductoProductoService } from './categoria-producto-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CategoriaProductoProductoController } from './categoria-producto-producto.controller';

@Module({
  providers: [CategoriaProductoProductoService],
  imports: [TypeOrmModule.forFeature([ProductoEntity, CategoriaProductoEntity])],
  controllers: [CategoriaProductoProductoController],
})
export class CategoriaProductoProductoModule {}