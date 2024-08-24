/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from './../receta/receta.entity';
import { RecetaDto } from './../receta/receta.dto';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';

@Resolver()
export class CulturaGastronomicaRecetaResolver {

    constructor(private culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService) { }


    @Query(() => RecetaEntity)
    recetaPorIdyCulturaId(@Args('idCultura') idCultura: number, @Args('idReceta') idReceta: number): Promise<RecetaEntity> {
        return this.culturaGastronomicaRecetaService.obtenerRecetasPorIdCulturaidReceta(idCultura, idReceta);
    }

    @Query(() => [RecetaEntity])
    recetasPorIdCultura(@Args('idCultura') idCultura: number): Promise<RecetaEntity[]> {
        const resultado = this.culturaGastronomicaRecetaService.obtenerRecetasPorIdCultura(idCultura);
        return  resultado;
    }


    @Mutation(() => CulturaGastronomicaEntity)
    asociarRecetaCultura(@Args('idCultura') idCultura: number, @Args('idReceta') idReceta: number): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaRecetaService.agregarRecetaCulturaGastronomica(idCultura, idReceta);
    }


    @Mutation(() => CulturaGastronomicaEntity)
    actualizarRecetaCultura(@Args('idCultura') idCultura: number,   @Args({ name: 'recetasDto', type: () => [RecetaDto] }) recetasDto: RecetaDto[]): Promise<CulturaGastronomicaEntity> {
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return this.culturaGastronomicaRecetaService.asociarRecetasCulturaGastronomica(idCultura, recetas);
    }

    @Mutation(() => Number)
    eliminarRecetaCultura(@Args('idCultura') idCultura: number, @Args('idReceta') idReceta: number) {
        this.culturaGastronomicaRecetaService.eliminarRecetaCultura(idCultura, idReceta);
        return idReceta;
    }

}