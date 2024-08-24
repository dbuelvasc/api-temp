// estrella-michelin.module.ts
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as sqliteStore from 'cache-manager-sqlite';

import { RestauranteEstrellaMichelinController } from './restaurante-estrella-michelin.controller';
import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin.entity';
import { RestauranteEstrellaMichelinService } from './restaurante-estrella-michelin.service';
import { RestauranteEstrellaMichelinResolver } from './restaurante-estrella-michelin.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestauranteEstrellaMichelinEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  providers: [
    RestauranteEstrellaMichelinService,
    RestauranteEstrellaMichelinResolver,
  ],
  exports: [RestauranteEstrellaMichelinService],
  controllers: [RestauranteEstrellaMichelinController],
})
export class EstrellaMichelinModule {}
