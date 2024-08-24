/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ErroresNegocioInterceptor } from './../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CulturaGastronomicaPaisService } from './cultura-gastronomica-pais.service';
import { PaisEntity } from './../pais/pais.entity';
import { PaisDto } from './../pais/pais.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('culturas-gastronomicas')
@UseInterceptors(ErroresNegocioInterceptor)
export class CulturaGastronomicaPaisController {
    constructor(private readonly culturaGastronomicaPaisService: CulturaGastronomicaPaisService) { }

    @Post(':idCultura/paises/:idPais')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async agregarPaisCulturaGastronomica(@Param('idCultura') idCultura: number, @Param('idPais') idPais: number) {
        return await this.culturaGastronomicaPaisService.agregarPaisCulturaGastronomica(idCultura, idPais);
    }

    @Get(':idCultura/paises/:idPais')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
    async obtenerPaisesPorIdCulturaIdPais(@Param('idCultura') idCultura: number, @Param('idPais') idPais: number) {
        return await this.culturaGastronomicaPaisService.obtenerPaisesPorIdCulturaIdPais(idCultura, idPais);
    }

    @Get(':idCultura/paises')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async obtenerPaisesPorIdCultura(@Param('idCultura') idCultura: number) {
        return await this.culturaGastronomicaPaisService.obtenerPaisesPorIdCultura(idCultura);
    }

    @Put(':idCultura/paises')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.WRITER)
    async asociarPaisesCulturaGastronomica(@Body() paisesDto: PaisDto[], @Param('idCultura') idCultura: number) {
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.culturaGastronomicaPaisService.asociarPaisesCulturaGastronomica(idCultura, paises);
    }

    @Delete(':idCultura/paises/:idPais')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.DELETE)
    @HttpCode(204)
    async eliminarPaisCultura(@Param('idCultura') idCultura: number, @Param('idPais') idPais: number) {
        return await this.culturaGastronomicaPaisService.eliminarPaisCultura(idCultura, idPais);
    }
}