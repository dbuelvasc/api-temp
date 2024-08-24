/* eslint-disable prettier/prettier */
import { CacheModule, Module } from '@nestjs/common';
import * as sqliteStore from 'cache-manager-sqlite';
import { CategoriaProductoService } from './categoria-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CategoriaProductoController } from './categoria-producto.controller';
import { CategoriaProductoResolver } from './categoria-producto.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaProductoEntity, ProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  providers: [CategoriaProductoService, CategoriaProductoEntity, CategoriaProductoResolver],
  exports: [CategoriaProductoService, CategoriaProductoEntity, TypeOrmModule.forFeature([CategoriaProductoEntity])],
  controllers: [CategoriaProductoController],
})
export class CategoriaProductoModule {}
