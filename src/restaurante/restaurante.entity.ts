/* eslint-disable prettier/prettier */
// restaurante.entity.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  ciudad: string;

  @Field(type => CulturaGastronomicaEntity)
  @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.restaurantes)
  culturaGastronomica: CulturaGastronomicaEntity;

}
