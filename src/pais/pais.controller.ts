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
import { PaisService } from './pais.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('paises')
@UseInterceptors(ErroresNegocioInterceptor)
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('paisId') paisId: number) {
    return await this.paisService.findOne(paisId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(@Param('paisId') paisId: number, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisId, pais);
  }

  @Delete(':paisId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('paisId') paisId: number) {
    return await this.paisService.delete(paisId);
  }
}
