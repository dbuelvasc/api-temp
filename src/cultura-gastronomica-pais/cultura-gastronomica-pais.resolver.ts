/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from './../pais/pais.entity';
import { PaisDto } from './../pais/pais.dto';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';

@Resolver()
export class CulturaGastronomicaPaisResolver {

    constructor(private culturaGastronomicaPaisService: CulturaGastronomicaPaisService) { }


    @Query(() => PaisEntity)
    paisPorIdyCulturaId(@Args('idCultura') idCultura: number, @Args('idPais') idPais: number): Promise<PaisEntity> {
        return this.culturaGastronomicaPaisService.obtenerPaisesPorIdCulturaIdPais(idCultura, idPais);
    }

    @Query(() => [PaisEntity])
    paisesPorIdCultura(@Args('idCultura') idCultura: number): Promise<PaisEntity[]> {
        const resultado = this.culturaGastronomicaPaisService.obtenerPaisesPorIdCultura(idCultura);
        return  resultado;
    }


    @Mutation(() => CulturaGastronomicaEntity)
    asociarPaisCultura(@Args('idCultura') idCultura: number, @Args('idPais') idPais: number): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaPaisService.agregarPaisCulturaGastronomica(idCultura, idPais);
    }


    @Mutation(() => CulturaGastronomicaEntity)
    actualizarPaisCultura(@Args('idCultura') idCultura: number,   @Args({ name: 'paisesDto', type: () => [PaisDto] }) paisesDto: PaisDto[]): Promise<CulturaGastronomicaEntity> {
        const paises = plainToInstance(PaisEntity, paisesDto)
        return this.culturaGastronomicaPaisService.asociarPaisesCulturaGastronomica(idCultura, paises);
    }

    @Mutation(() => Number)
    eliminarPaisCultura(@Args('idCultura') idCultura: number, @Args('idPais') idPais: number) {
        this.culturaGastronomicaPaisService.eliminarPaisCultura(idCultura, idPais);
        return idPais;
    }

}