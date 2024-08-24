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
import { RestauranteEstrellaMichelinService } from './restaurante-estrella-michelin.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { RestauranteEstrellaMichelinDto } from './restaurante-estrella-michelin.dto'; // Replace with the actual path to your DTO
import { RestauranteEstrellaMichelinEntity } from './restaurante-estrella-michelin.entity'; // Replace with the actual path to your entity
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('restaurantes-estrella-michelin')
@UseInterceptors(ErroresNegocioInterceptor)
export class RestauranteEstrellaMichelinController {
  constructor(
    private readonly restauranteRestauranteEstrellaMichelinService: RestauranteEstrellaMichelinService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.restauranteRestauranteEstrellaMichelinService.listarTodas();
  }

  @Get(':estrellaMichelinId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('estrellaMichelinId') estrellaMichelinId: number) {
    return await this.restauranteRestauranteEstrellaMichelinService.obtenerPorId(
      estrellaMichelinId,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async create(
    @Body() restauranteEstrellaMichelinDto: RestauranteEstrellaMichelinDto,
  ) {
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = plainToInstance(
      RestauranteEstrellaMichelinEntity,
      restauranteEstrellaMichelinDto,
    );
    return await this.restauranteRestauranteEstrellaMichelinService.crear(
      estrellaMichelin,
    );
  }

  @Put(':estrellaMichelinId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(
    @Param('estrellaMichelinId') estrellaMichelinId: number,
    @Body() restauranteEstrellaMichelinDto: RestauranteEstrellaMichelinDto,
  ) {
    const estrellaMichelin: RestauranteEstrellaMichelinEntity = plainToInstance(
      RestauranteEstrellaMichelinEntity,
      restauranteEstrellaMichelinDto,
    );
    return await this.restauranteRestauranteEstrellaMichelinService.actualizar(
      estrellaMichelinId,
      estrellaMichelin,
    );
  }

  @Delete(':estrellaMichelinId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('estrellaMichelinId') estrellaMichelinId: number) {
    return await this.restauranteRestauranteEstrellaMichelinService.eliminar(
      estrellaMichelinId,
    );
  }
}
