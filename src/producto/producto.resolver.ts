import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { ProductoDto } from './producto.dto';

@Resolver()
export class ProductoResolver {
  constructor(private productoService: ProductoService) {}

  @Query(() => [ProductoEntity])
  productos(): Promise<ProductoEntity[]> {
    return this.productoService.findAll();
  }

  @Query(() => ProductoEntity)
  producto(@Args('id') id: number): Promise<ProductoEntity> {
    return this.productoService.findOne(id);
  }

  @Mutation(() => ProductoEntity)
  createProducto(
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.create(producto);
  }

  @Mutation(() => ProductoEntity)
  updateProducto(
    @Args('id') id: number,
    @Args('producto') productoDto: ProductoDto,
  ): Promise<ProductoEntity> {
    const producto = plainToInstance(ProductoEntity, productoDto);
    return this.productoService.update(id, producto);
  }

  @Mutation(() => String)
  deleteProducto(@Args('id') id: number) {
    this.productoService.delete(id);
    return id;
  }
}
