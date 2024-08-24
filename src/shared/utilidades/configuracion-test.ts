/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaGastronomicaEntity } from './../../cultura-gastronomica/cultura-gastronomica.entity';
import { RestauranteEntity } from './../../restaurante/restaurante.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { CategoriaProductoEntity } from '../../categoria-producto/categoria-producto.entity';
import { RestauranteEstrellaMichelinEntity } from '../../restaurante-estrella-michelin/restaurante-estrella-michelin.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [
      CulturaGastronomicaEntity,
      RestauranteEntity,
      PaisEntity,
      ProductoEntity,
      RecetaEntity,
      CategoriaProductoEntity,
      RestauranteEstrellaMichelinEntity,
    ],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    CulturaGastronomicaEntity,
    RestauranteEntity,
    PaisEntity,
    ProductoEntity,
    RecetaEntity,
    CategoriaProductoEntity,
    RestauranteEstrellaMichelinEntity,
  ]),
];
