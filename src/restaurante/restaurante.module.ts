// restaurante.module.ts
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as sqliteStore from 'cache-manager-sqlite';

import { RestauranteController } from './restaurante.controller';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';
import { RestauranteResolver } from './restaurante.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestauranteEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  providers: [RestauranteService, RestauranteResolver],
  exports: [RestauranteService],
  controllers: [RestauranteController],
})
export class RestauranteModule {}
