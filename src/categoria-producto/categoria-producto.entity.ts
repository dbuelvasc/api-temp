import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CategoriaProductoEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [ProductoEntity])
  @OneToMany(() => ProductoEntity, (producto) => producto.categoriaProducto)
  productos: ProductoEntity[];
}
