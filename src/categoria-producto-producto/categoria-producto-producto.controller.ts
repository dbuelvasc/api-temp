/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CategoriaProductoProductoService } from './categoria-producto-producto.service';
import { ProductoDto } from 'src/producto/producto.dto';
import { ProductoEntity } from 'src/producto/producto.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';


@Controller('categoria-productos')
@UseInterceptors(ErroresNegocioInterceptor)
export class CategoriaProductoProductoController {
    constructor(private readonly categoriaProductoProductoService: CategoriaProductoProductoService){}

    @Post(':idCategoriaProducto/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async agregarProductoCategoriaProducto(@Param('idCategoriaProducto') idCategoriaProducto: number, @Param('idProducto') idProducto: number){
        return await this.categoriaProductoProductoService.agregarProductoCategoriaProducto(idCategoriaProducto, idProducto);
    }

    @Get(':idCategoriaProducto/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async obtenerProductosPorIdCategoriaProductoidProducto(@Param('idCategoriaProducto') idCategoriaProducto: number, @Param('idProducto') idProducto: number){
        return await this.categoriaProductoProductoService.obtenerProductosPorIdCategoriaProductoidProducto(idCategoriaProducto, idProducto);
    }

    @Get(':idCategoriaProducto/productos')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async obtenerProductosPorIdCategoriaProducto(@Param('idCategoriaProducto') idCategoriaProducto: number){
        return await this.categoriaProductoProductoService.obtenerProductosPorIdCategoriaProducto(idCategoriaProducto);
    }

    @Put(':idCategoriaProducto/productos')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async asociarProductosCategoriaProducto(@Body() productosDto: ProductoDto[], @Param('idCategoriaProducto') idCategoriaProducto: number){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.categoriaProductoProductoService.asociarProductosCategoriaProducto(idCategoriaProducto, productos);
    }
    
    @Delete(':idCategoriaProducto/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async eliminarProductoCategoriaProducto(@Param('idCategoriaProducto') idCategoriaProducto: number, @Param('idProducto') idProducto: number){
        return await this.categoriaProductoProductoService.eliminarProductoCategoriaProducto(idCategoriaProducto, idProducto);
    }
}