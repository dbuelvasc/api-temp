/* eslint-disable prettier/prettier */
// estrella-michelin.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RestauranteEstrellaMichelinEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date)
  @Column({ type: 'date' })
  fechaConsecucion: Date;

  @Field()
  @OneToOne(() => RestauranteEntity)
  @JoinColumn()
  restaurante: RestauranteEntity;
}
