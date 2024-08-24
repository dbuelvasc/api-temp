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
import { ProductoService } from './producto.service';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('productos')
@UseInterceptors(ErroresNegocioInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('productoId') productoId: number) {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(
    @Param('productoId') productoId: number,
    @Body() productoDto: ProductoDto,
  ) {
    const producto: ProductoEntity = plainToInstance(
      ProductoEntity,
      productoDto,
    );
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('productoId') productoId: number) {
    return await this.productoService.delete(productoId);
  }
}
