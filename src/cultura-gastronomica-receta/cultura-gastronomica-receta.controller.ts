/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresNegocioInterceptor } from './../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CulturaGastronomicaRecetaService } from './cultura-gastronomica-receta.service';
import { RecetaDto } from './../receta/receta.dto';
import { RecetaEntity } from './..//receta/receta.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('culturas-gastronomicas')
@UseInterceptors(ErroresNegocioInterceptor)
export class CulturaGastronomicaRecetaController {
    constructor(private readonly culturaGastronomicaRecetaService: CulturaGastronomicaRecetaService) { }

    @Post(':idCultura/recetas/:idReceta')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async agregarRecetaCulturaGastronomica(@Param('idCultura') idCultura: number, @Param('idReceta') idReceta: number) {
        return await this.culturaGastronomicaRecetaService.agregarRecetaCulturaGastronomica(idCultura, idReceta);
    }

    @Get(':idCultura/recetas/:idReceta')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async obtenerRecetasPorIdCulturaidReceta(@Param('idCultura') idCultura: number, @Param('idReceta') idReceta: number) {
        return await this.culturaGastronomicaRecetaService.obtenerRecetasPorIdCulturaidReceta(idCultura, idReceta);
    }

    @Get(':idCultura/recetas')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async obtenerRecetasPorIdCultura(@Param('idCultura') idCultura: number) {
        return await this.culturaGastronomicaRecetaService.obtenerRecetasPorIdCultura(idCultura);
    }

    @Put(':idCultura/recetas')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async asociarRecetasCulturaGastronomica(@Body() recetasDto: RecetaDto[], @Param('idCultura') idCultura: number) {
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return await this.culturaGastronomicaRecetaService.asociarRecetasCulturaGastronomica(idCultura, recetas);
    }

    @Delete(':idCultura/recetas/:idReceta')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async eliminarRecetaCultura(@Param('idCultura') idCultura: number, @Param('idReceta') idReceta: number) {
        return await this.culturaGastronomicaRecetaService.eliminarRecetaCultura(idCultura, idReceta);
    }
}