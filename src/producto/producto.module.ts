import { CacheModule, Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { ProductoController } from './producto.controller';
import { ProductoResolver } from './producto.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [ProductoService, ProductoEntity, ProductoResolver],
  imports: [
    TypeOrmModule.forFeature([ProductoEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  exports: [ProductoEntity, TypeOrmModule.forFeature([ProductoEntity])],
  controllers: [ProductoController],
})
export class ProductoModule {}
