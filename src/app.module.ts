/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaModule } from './cultura-gastronomica/cultura-gastronomica.module';
import { CulturaGastronomicaEntity } from './cultura-gastronomica/cultura-gastronomica.entity';
import { CulturaGastronomicaPaisModule } from './cultura-gastronomica-pais/cultura-gastronomica-pais.module';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto/cultura-gastronomica-producto.service';
import { CulturaGastronomicaProductoModule } from './cultura-gastronomica-producto/cultura-gastronomica-producto.module';
import { CulturaGastronomicaRecetaModule } from './cultura-gastronomica-receta/cultura-gastronomica-receta.module';
import { CulturaGastronomicaRestauranteModule } from './cultura-gastronomica-restaurante/cultura-gastronomica-restaurante.module';
import { PaisCulturaGastronomicaModule } from './pais-cultura-gastronomica/pais-cultura-gastronomica.module';
import { PaisModule } from './pais/pais.module';
import { PaisEntity } from './pais/pais.entity';
import { ProductoModule } from './producto/producto.module';
import { ProductoEntity } from './producto/producto.entity';
import { RecetaModule } from './receta/receta.module';
import { RecetaEntity } from './receta/receta.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';
import { RestauranteModule } from './restaurante/restaurante.module';
import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin/restaurante-estrella-michelin.entity';
import { CategoriaProductoEntity } from './categoria-producto/categoria-producto.entity';
import { CategoriaProductoModule } from './categoria-producto/categoria-producto.module';
import { CategoriaProductoProductoModule } from './categoria-producto-producto/categoria-producto-producto.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EstrellaMichelinModule } from './restaurante-estrella-michelin/restaurante-estrella-michelin.module';

import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';


const db_host = process.env.DB_HOST || 'localhost';
const db_port = parseInt(process.env.DB_PORT, 10) || 5432
const db_username = process.env.DB_USERNAME || 'postgres';
const db_password = process.env.DB_PASSWORD || 'postgres';
const db_database = process.env.DB_DATABASE || 'postgres';
@Module({
  imports: [
    CulturaGastronomicaModule,
    PaisModule,
    ProductoModule,
    RecetaModule,
    RestauranteModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: db_host,
      port: db_port,
      username: db_username,
      password: db_password,
      database: db_database,
      entities: [
        CulturaGastronomicaEntity,
        PaisEntity,
        ProductoEntity,
        RecetaEntity,
        RestauranteEntity,
        CategoriaProductoEntity,
        RestauranteEstrellaMichelinEntity,
      ],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    CulturaGastronomicaPaisModule,
    CulturaGastronomicaProductoModule,
    CulturaGastronomicaRecetaModule,
    CulturaGastronomicaRestauranteModule,
    PaisCulturaGastronomicaModule,
    CategoriaProductoModule,
    CategoriaProductoProductoModule,
    EstrellaMichelinModule,
    UserModule,
    AuthModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
