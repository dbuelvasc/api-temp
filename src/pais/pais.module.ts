import { CacheModule, Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [PaisService, PaisEntity, PaisResolver],
  imports: [
    TypeOrmModule.forFeature([PaisEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  exports: [PaisEntity, TypeOrmModule.forFeature([PaisEntity])],
  controllers: [PaisController],
})
export class PaisModule {}
