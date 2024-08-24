/* eslint-disable prettier/prettier */
import { ProductoEntity } from '../producto/producto.entity';
import { PaisEntity } from '../pais/pais.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Column, Entity, OneToMany, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RecetaEntity } from '../receta/receta.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class CulturaGastronomicaEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    nombre: string;

    @Field()
    @Column()
    descripcion: string;

    @Field(type => [PaisEntity])
    @ManyToMany(() => PaisEntity, pais => pais.culturasGastronomicas)
    paises: PaisEntity[];

    @Field(type => [ProductoEntity])
    @OneToMany(() => ProductoEntity, producto => producto.culturaGastronomica)
    productos: ProductoEntity[];

    @Field(type => [RecetaEntity])
    @OneToMany(() => RecetaEntity, receta => receta.culturaGastronomica)
    recetas: RecetaEntity[];

    @Field(type => [RestauranteEntity])
    @OneToMany(() => RestauranteEntity, restaurante => restaurante.culturaGastronomica)
    restaurantes: RestauranteEntity[];

}