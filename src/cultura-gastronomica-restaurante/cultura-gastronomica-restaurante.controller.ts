/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CulturaGastronomicaRestauranteService } from './cultura-gastronomica-restaurante.service';
import { RestauranteEntity } from './../restaurante/restaurante.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';
import { ErroresNegocioInterceptor } from './../shared/interceptores/errores-negocio/errores-negocio.interceptor';

@Controller('culturas-gastronomicas')
@UseInterceptors(ErroresNegocioInterceptor)
export class CulturaGastronomicaRestauranteController {
  constructor(
    private readonly culturaGastronomicaRestauranteService: CulturaGastronomicaRestauranteService,
  ) {}

  @Post(':idCultura/restaurantes/:idRestaurante')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async agregarRestauranteCulturaGastronomica(
    @Param('idCultura') idCultura: number,
    @Param('idRestaurante') idRestaurante: number,
  ) {
    return await this.culturaGastronomicaRestauranteService.agregarRestauranteCulturaGastronomica(
      idCultura,
      idRestaurante,
    );
  }

  @Get(':idCultura/restaurantes/:idRestaurante')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async obtenerRestaurantesPorIdCulturaidRestaurante(
    @Param('idCultura') idCultura: number,
    @Param('idRestaurante') idRestaurante: number,
  ) {
    return await this.culturaGastronomicaRestauranteService.obtenerRestaurantesPorIdCulturaidRestaurante(
      idCultura,
      idRestaurante,
    );
  }

  @Get(':idCultura/restaurantes')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async obtenerRestaurantesPorIdCultura(@Param('idCultura') idCultura: number) {
    return await this.culturaGastronomicaRestauranteService.obtenerRestaurantesPorIdCultura(
      idCultura,
    );
  }

  @Put(':idCultura/restaurantes')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async asociarRestaurantesCulturaGastronomica(
    @Body() restaurantesDto: RestauranteEntity[],
    @Param('idCultura') idCultura: number,
  ) {
    return await this.culturaGastronomicaRestauranteService.asociarRestaurantesCulturaGastronomica(
      idCultura,
      restaurantesDto,
    );
  }

  @Delete(':idCultura/restaurantes/:idRestaurante')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async eliminarRestauranteCultura(
    @Param('idCultura') idCultura: number,
    @Param('idRestaurante') idRestaurante: number,
  ) {
    return await this.culturaGastronomicaRestauranteService.eliminarRestauranteCultura(
      idCultura,
      idRestaurante,
    );
  }
}
