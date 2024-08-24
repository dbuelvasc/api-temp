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
import { RestauranteService } from './restaurante.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('restaurantes')
@UseInterceptors(ErroresNegocioInterceptor)
export class RestauranteController {
  constructor(private readonly restauranteService: RestauranteService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.restauranteService.listarTodos();
  }

  @Get(':restauranteId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('restauranteId') restauranteId: number) {
    return await this.restauranteService.obtenerPorId(restauranteId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async create(@Body() restauranteDto: RestauranteDto) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.crear(restaurante);
  }

  @Put(':restauranteId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(
    @Param('restauranteId') restauranteId: number,
    @Body() restauranteDto: RestauranteDto,
  ) {
    const restaurante: RestauranteEntity = plainToInstance(
      RestauranteEntity,
      restauranteDto,
    );
    return await this.restauranteService.actualizar(restauranteId, restaurante);
  }

  @Delete(':restauranteId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('restauranteId') restauranteId: number) {
    return await this.restauranteService.eliminar(restauranteId);
  }
}
