/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';

@Resolver()
export class CulturaGastronomicaResolver {

    constructor(private culturaGastronomicaService: CulturaGastronomicaService) {}

    @Query(() => [CulturaGastronomicaEntity])
    culturas(): Promise<CulturaGastronomicaEntity[]> {
        return this.culturaGastronomicaService.findAll();
    }
 
    @Query(() => CulturaGastronomicaEntity)
    cultura(@Args('id') id: number): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaService.findOne(id);
    }

    @Mutation(() => CulturaGastronomicaEntity)
    createCultura(@Args('cultura') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.create(cultura);
    }
 
    @Mutation(() => CulturaGastronomicaEntity)
    updateCultura(@Args('id') id: number, @Args('cultura') culturaGastronomicaDto: CulturaGastronomicaDto): Promise<CulturaGastronomicaEntity> {
        const cultura = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
        return this.culturaGastronomicaService.update(id, cultura);
    }
 
    @Mutation(() => String)
    deleteCultura(@Args('id') id: number) {
        this.culturaGastronomicaService.delete(id);
        return id;
    }

}


