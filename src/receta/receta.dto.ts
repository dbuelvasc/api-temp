/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@InputType()
export class RecetaDto {
    @Field()
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @Field()
    @IsUrl()
    @IsNotEmpty()
    urlFoto: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    procesoPreparacion: string;

    @Field()
    @IsUrl()
    @IsNotEmpty()
    videoPreparacion: string;

}
