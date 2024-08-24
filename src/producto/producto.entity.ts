/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductoEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  descripcion: string;

  @Field()
  @Column()
  historia: string;

  @Field(type => CulturaGastronomicaEntity)
  @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.productos)
  culturaGastronomica: CulturaGastronomicaEntity;

  @Field(type => CategoriaProductoEntity)
  @ManyToOne(() => CategoriaProductoEntity, (categoriaProducto) => categoriaProducto.productos)
  categoriaProducto: CategoriaProductoEntity;
}
