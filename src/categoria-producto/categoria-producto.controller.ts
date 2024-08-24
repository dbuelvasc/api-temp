import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { ErroresNegocioInterceptor } from '../shared/interceptores/errores-negocio/errores-negocio.interceptor';
import { CategoriaProductoService } from './categoria-producto.service';
import { CategoriaProductoDto } from './categoria-producto.dto';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/roles/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import userRoles from './../shared/security/roles_usuario';

@Controller('categoria-productos')
@UseInterceptors(ErroresNegocioInterceptor)
export class CategoriaProductoController {
  constructor(private readonly categoriaProductoService: CategoriaProductoService) { }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.FULL_READER)
  async findAll() {
    return await this.categoriaProductoService.findAll();
  }

  @Get(':idCategoriaProducto')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.LIMITED_READER)
  async findOne(@Param('idCategoriaProducto') idCategoriaProducto: number) {
    return await this.categoriaProductoService.findOne(idCategoriaProducto);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  @HttpCode(201)
  async create(@Body() categoriaProductoDto: CategoriaProductoDto) {
    const cultura: CategoriaProductoEntity = plainToInstance(CategoriaProductoEntity, categoriaProductoDto);
    return await this.categoriaProductoService.create(cultura);
  }

  @Put(':idCategoriaProducto')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.WRITER)
  async update(@Param('idCategoriaProducto') idCategoriaProducto: number, @Body() categoriaProductoDto: CategoriaProductoDto) {
    const cultura: CategoriaProductoEntity = plainToInstance(CategoriaProductoEntity, categoriaProductoDto);
    return await this.categoriaProductoService.update(idCategoriaProducto, cultura);
  }

  @Delete(':idCategoriaProducto')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(userRoles.ADMIN, userRoles.DELETE)
  @HttpCode(204)
  async delete(@Param('idCategoriaProducto') idCategoriaProducto: number) {
    return await this.categoriaProductoService.delete(idCategoriaProducto);
  }
}
