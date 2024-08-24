/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CulturaGastronomicaProductoService } from './cultura-gastronomica-producto.service';
import { ProductoEntity } from '../producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('culturas-gastronomicas')
@UseInterceptors(ErroresNegocioInterceptor)
export class CulturaGastronomicaProductoController {
    constructor(private readonly culturaGastronomicaProductoService: CulturaGastronomicaProductoService){}

    @Post(':idCultura/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async agregarProductoCulturaGastronomica(@Param('idCultura') idCultura: number, @Param('idProducto') idProducto: number){
        return await this.culturaGastronomicaProductoService.agregarProductoCulturaGastronomica(idCultura, idProducto);
    }

    @Get(':idCultura/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async obtenerProductosPorIdCulturaidProducto(@Param('idCultura') idCultura: number, @Param('idProducto') idProducto: number){
        return await this.culturaGastronomicaProductoService.obtenerProductosPorIdCulturaidProducto(idCultura, idProducto);
    }

    @Get(':idCultura/productos')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async obtenerProductosPorIdCultura(@Param('idCultura') idCultura: number){
        return await this.culturaGastronomicaProductoService.obtenerProductosPorIdCultura(idCultura);
    }

    @Put(':idCultura/productos')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async asociarProductosCulturaGastronomica(@Body() productosDto: ProductoDto[], @Param('idCultura') idCultura: number){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaGastronomicaProductoService.asociarProductosCulturaGastronomica(idCultura, productos);
    }
    
    @Delete(':idCultura/productos/:idProducto')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async eliminarProductoCultura(@Param('idCultura') idCultura: number, @Param('idProducto') idProducto: number){
        return await this.culturaGastronomicaProductoService.eliminarProductoCultura(idCultura, idProducto);
    }
}