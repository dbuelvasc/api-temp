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
import { RecetaService } from './receta.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('recetas')
@UseInterceptors(ErroresNegocioInterceptor)
export class RecetaController {
  constructor(private readonly recetaService: RecetaService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':recetaId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('recetaId') recetaId: number) {
    return await this.recetaService.findOne(recetaId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async create(@Body() recetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':recetaId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(
    @Param('recetaId') recetaId: number,
    @Body() recetaDto: RecetaDto,
  ) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, recetaDto);
    return await this.recetaService.update(recetaId, receta);
  }

  @Delete(':recetaId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('recetaId') recetaId: number) {
    return await this.recetaService.delete(recetaId);
  }
}
