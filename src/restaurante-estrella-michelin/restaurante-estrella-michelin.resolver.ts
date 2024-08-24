import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RestauranteEstrellaMichelinService } from './restaurante-estrella-michelin.service';
import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin.entity';
import { RestauranteEstrellaMichelinDto } from './restaurante-estrella-michelin.dto'; // You need to create this DTO

@Resolver(() => RestauranteEstrellaMichelinEntity)
export class RestauranteEstrellaMichelinResolver {
  constructor(
    private readonly restauranteEstrellaMichelinService: RestauranteEstrellaMichelinService,
  ) {}

  @Query(() => [RestauranteEstrellaMichelinEntity])
  estrellasMichelin(): Promise<RestauranteEstrellaMichelinEntity[]> {
    return this.restauranteEstrellaMichelinService.listarTodas();
  }

  @Query(() => RestauranteEstrellaMichelinEntity)
  estrellaMichelin(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RestauranteEstrellaMichelinEntity> {
    return this.restauranteEstrellaMichelinService.obtenerPorId(id);
  }

  @Mutation(() => RestauranteEstrellaMichelinEntity)
  createEstrellaMichelin(
    @Args('estrellaMichelin')
    restauranteEstrellaMichelinDto: RestauranteEstrellaMichelinDto,
  ): Promise<RestauranteEstrellaMichelinEntity> {
    return this.restauranteEstrellaMichelinService.crear(
      restauranteEstrellaMichelinDto,
    );
  }

  @Mutation(() => RestauranteEstrellaMichelinEntity)
  updateEstrellaMichelin(
    @Args('id', { type: () => Int }) id: number,
    @Args('estrellaMichelin')
    restauranteEstrellaMichelinDto: RestauranteEstrellaMichelinDto,
  ): Promise<RestauranteEstrellaMichelinEntity> {
    return this.restauranteEstrellaMichelinService.actualizar(
      id,
      restauranteEstrellaMichelinDto,
    );
  }

  @Mutation(() => Boolean)
  deleteEstrellaMichelin(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.restauranteEstrellaMichelinService
      .eliminar(id)
      .then(() => true)
      .catch(() => false);
  }
}
