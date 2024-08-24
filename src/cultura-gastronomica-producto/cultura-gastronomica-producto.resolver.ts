/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { ProductoEntity } from './../producto/producto.entity';
import { ProductoDto } from './../producto/producto.dto';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';


@Resolver()
export class CulturaGastronomicaProductoResolver {

    constructor(private culturaGastronomicaProductoService: CulturaGastronomicaProductoService) { }


    @Query(() => ProductoEntity)
    productoPorIdyCulturaId(@Args('idCultura') idCultura: number, @Args('idProducto') idProducto: number): Promise<ProductoEntity> {
        return this.culturaGastronomicaProductoService.obtenerProductosPorIdCulturaidProducto(idCultura, idProducto);
    }

    @Query(() => [ProductoEntity])
    productosPorIdCultura(@Args('idCultura') idCultura: number): Promise<ProductoEntity[]> {
        const resultado = this.culturaGastronomicaProductoService.obtenerProductosPorIdCultura(idCultura);
        return  resultado;
    }


    @Mutation(() => CulturaGastronomicaEntity)
    asociarProductoCultura(@Args('idCultura') idCultura: number, @Args('idProducto') idProducto: number): Promise<CulturaGastronomicaEntity> {
        return this.culturaGastronomicaProductoService.agregarProductoCulturaGastronomica(idCultura, idProducto);
    }


    @Mutation(() => CulturaGastronomicaEntity)
    actualizarProductoCultura(@Args('idCultura') idCultura: number,   @Args({ name: 'productosDto', type: () => [ProductoDto] }) productosDto: ProductoDto[]): Promise<CulturaGastronomicaEntity> {
        const productos = plainToInstance(ProductoEntity, productosDto)
        return this.culturaGastronomicaProductoService.asociarProductosCulturaGastronomica(idCultura, productos);
    }

    @Mutation(() => Number)
    eliminarProductoCultura(@Args('idCultura') idCultura: number, @Args('idProducto') idProducto: number) {
        this.culturaGastronomicaProductoService.eliminarProductoCultura(idCultura, idProducto);
        return idProducto;
    }

}