/* eslint-disable prettier/prettier */
import { Controller, Get, Param, UseInterceptors, UseGuards } from '@nestjs/common';

import { ErroresNegocioInterceptor } from './../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { PaisCulturaGastronomicaService } from './pais-cultura-gastronomica.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';


@Controller('paises')
@UseInterceptors(ErroresNegocioInterceptor)
export class PaisCulturaGastronomicaController {
    constructor(private readonly paisCulturaGastronomicaService: PaisCulturaGastronomicaService) { }

    @Get(':idPais/culturas-gastronomicas')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(userRoles.ADMIN, userRoles.FULL_READER)
    async obtenerPaisesPorIdCultura(@Param('idPais') idPais: number) {
        return await this.paisCulturaGastronomicaService.obtenerCulturasPorIdPais(idPais);
    }

}