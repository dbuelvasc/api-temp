/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecetaEntity {
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
  urlFoto: string;

  @Field()
  @Column()
  procesoPreparacion: string;

  @Field()
  @Column()
  videoPreparacion: string;

  @Field(type => CulturaGastronomicaEntity)
  @ManyToOne(() => CulturaGastronomicaEntity, culturaGastronomica => culturaGastronomica.recetas)
  culturaGastronomica: CulturaGastronomicaEntity;
}
