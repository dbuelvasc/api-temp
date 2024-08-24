/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Resolver(() => RestauranteEntity)
export class RestauranteResolver {
  constructor(private restauranteService: RestauranteService) {}

  @Query(() => [RestauranteEntity])
  restaurantes(): Promise<RestauranteEntity[]> {
    return this.restauranteService.listarTodos();
  }

  @Query(() => RestauranteEntity)
  restaurante(@Args('id') id: number): Promise<RestauranteEntity> {
    return this.restauranteService.obtenerPorId(id);
  }

  @Mutation(() => RestauranteEntity)
  createRestaurante(
    @Args('restaurante') restauranteDto: RestauranteDto,
  ): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.crear(restaurante);
  }

  @Mutation(() => RestauranteEntity)
  updateRestaurante(
    @Args('id') id: number,
    @Args('restaurante') restauranteDto: RestauranteDto,
  ): Promise<RestauranteEntity> {
    const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
    return this.restauranteService.actualizar(id, restaurante);
  }

  @Mutation(() => String)
  deleteRestaurante(@Args('id') id: number) {
    this.restauranteService.eliminar(id);
    return id;
  }
}
