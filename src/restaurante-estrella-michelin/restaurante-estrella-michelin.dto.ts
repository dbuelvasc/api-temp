/* eslint-disable prettier/prettier */
import { Field, GraphQLISODateTime, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';

@InputType()
export class RestauranteEstrellaMichelinDto {
  @Field(() => GraphQLISODateTime)
  @IsDate()
  @IsNotEmpty()
  fechaConsecucion: Date;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  restauranteId: number;
}
