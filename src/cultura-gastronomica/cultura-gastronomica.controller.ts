/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CulturaGastronomicaService } from './cultura-gastronomica.service';
import { CulturaGastronomicaDto } from './cultura-gastronomica.dto';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';


@Controller('culturas-gastronomicas')
@UseInterceptors(ErroresNegocioInterceptor)
export class CulturaGastronomicaController {

  constructor(private readonly culturaGastronomicaService: CulturaGastronomicaService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.culturaGastronomicaService.findAll();
  }

  @Get(':idCultura')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('idCultura') idCultura: number) {
    return await this.culturaGastronomicaService.findOne(idCultura);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  @HttpCode(201)
  async create(@Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
    const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
    return await this.culturaGastronomicaService.create(cultura);
  }

  @Put(':idCultura')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(@Param('idCultura') idCultura: number, @Body() culturaGastronomicaDto: CulturaGastronomicaDto) {
    const cultura: CulturaGastronomicaEntity = plainToInstance(CulturaGastronomicaEntity, culturaGastronomicaDto);
    return await this.culturaGastronomicaService.update(idCultura, cultura);
  }

  @Delete(':idCultura')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('idCultura') idCultura: number) {
    return await this.culturaGastronomicaService.delete(idCultura);
  }
}
