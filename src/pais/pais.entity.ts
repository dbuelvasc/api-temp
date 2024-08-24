/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class PaisEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  nombre: string;

  @Field(type => [CulturaGastronomicaEntity])
  @ManyToMany(() => CulturaGastronomicaEntity, (culturaGastronomica) => culturaGastronomica.paises,)
  @JoinTable()
  culturasGastronomicas: CulturaGastronomicaEntity[];
}
