import { CacheModule, Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [RecetaService, RecetaResolver],
  imports: [
    TypeOrmModule.forFeature([RecetaEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 30,
      },
      path: ':memory:',
    }),
  ],
  controllers: [RecetaController],
})
export class RecetaModule {}
