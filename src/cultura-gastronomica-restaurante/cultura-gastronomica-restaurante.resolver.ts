/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteEntity } from './../restaurante/restaurante.entity';
import { RestauranteDto } from './../restaurante/restaurante.dto';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';

@Resolver()
export class CulturaGastronomicaRestauranteResolver {

    constructor(private culturaGastronomicaRestauranteService: CulturaGastronomicaRestauranteService) { }


    @Query(() => RestauranteEntity)
    restaurantePorIdyCulturaId(@Args('idCultura') idCultura: number, @Args('idRestaurante') idRestaurante: number): Promise<RestauranteEntity> {
        return this.culturaGastronomicaRestauranteService.obtenerRestaurantesPorIdCulturaidRestaurante(idCultura, idRestaurante);
    }

    @Query(() => [RestauranteEntity])
    restaurantesPorIdCultura(@Args('idCultura') idCultura: number): Promise<RestauranteEntity[]> {
        const resultado = this.culturaGastronomicaRestauranteService.obtenerRestaurantesPorIdCultura(idCultura);
        return  resultado;
    }


    @Mutation(() => CulturaGastronomicaEntity)
    asociarRestauranteCultura(@Args('idCultura') idCultura: number, @Args('idRestaurante') idRestaurante: number): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaRestauranteService.agregarRestauranteCulturaGastronomica(idCultura, idRestaurante);
    }


    @Mutation(() => CulturaGastronomicaEntity)
    actualizarRestauranteCultura(@Args('idCultura') idCultura: number,   @Args({ name: 'restaurantesDto', type: () => [RestauranteDto] }) restaurantesDto: RestauranteDto[]): Promise<CulturaGastronomicaEntity> {
        const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
        return this.culturaGastronomicaRestauranteService.asociarRestaurantesCulturaGastronomica(idCultura, restaurantes);
    }

    @Mutation(() => Number)
    eliminarRestauranteCultura(@Args('idCultura') idCultura: number, @Args('idRestaurante') idRestaurante: number) {
        this.culturaGastronomicaRestauranteService.eliminarRestauranteCultura(idCultura, idRestaurante);
        return idRestaurante;
    }

}