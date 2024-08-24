/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { CategoriaProductoDto } from './categoria-producto.dto';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { CategoriaProductoService } from './categoria-producto.service';

@Resolver()
export class CategoriaProductoResolver {

    constructor(private categoriaProductoService: CategoriaProductoService) {}

    @Query(() => [CategoriaProductoEntity])
    categoriaProductos(): Promise<CategoriaProductoEntity[]> {
        return this.categoriaProductoService.findAll();
    }
 
    @Query(() => CategoriaProductoEntity)
    categoriaProducto(@Args('id') id: number): Promise<CategoriaProductoEntity> {
        return this.categoriaProductoService.findOne(id);
    }

    @Mutation(() => CategoriaProductoEntity)
    createCategoriaProducto(@Args('categoriaProducto') categoriaProductoDto: CategoriaProductoDto): Promise<CategoriaProductoEntity> {
        const categoriaProducto = plainToInstance(CategoriaProductoEntity, categoriaProductoDto);
        return this.categoriaProductoService.create(categoriaProducto);
    }
 
    @Mutation(() => CategoriaProductoEntity)
    updateCategoriaProducto(@Args('id') id: number, @Args('categoriaProducto') categoriaProductoDto: CategoriaProductoDto): Promise<CategoriaProductoEntity> {
        const categoriaProducto = plainToInstance(CategoriaProductoEntity, categoriaProductoDto);
        return this.categoriaProductoService.update(id, categoriaProducto);
    }
 
    @Mutation(() => String)
    deleteCategoriaProducto(@Args('id') id: number) {
        this.categoriaProductoService.delete(id);
        return id;
    }

}


