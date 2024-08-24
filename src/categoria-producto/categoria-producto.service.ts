import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaProductoEntity } from './categoria-producto.entity';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class CategoriaProductoService {
  cacheKey = 'categoria-productos';
  constructor(
    @InjectRepository(CategoriaProductoEntity)
    private readonly categoriaProductosRepository: Repository<CategoriaProductoEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<CategoriaProductoEntity[]> {
    const cached: CategoriaProductoEntity[] = await this.cacheManager.get<CategoriaProductoEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const categoriaProductos: CategoriaProductoEntity[] = await this.categoriaProductosRepository.find({
        relations: ['productos'],
      });
      await this.cacheManager.set(this.cacheKey, categoriaProductos);
      return categoriaProductos;
    }
    return cached;
  }

  async findOne(id: number): Promise<CategoriaProductoEntity> {
    const categoriaProductos: CategoriaProductoEntity = await this.categoriaProductosRepository.findOne({
      where: { id },
      relations: ['productos'],
    });
    if (!categoriaProductos)
      throw new ExcepcionNegocio(
        'Categoría de productos no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return categoriaProductos;
  }

  async create(categoriaProductos: CategoriaProductoEntity): Promise<CategoriaProductoEntity> {
    return await this.categoriaProductosRepository.save(categoriaProductos);
  }

  async update(id: number, categoriaProductos: CategoriaProductoEntity): Promise<CategoriaProductoEntity> {
    const categoriaPersistida: CategoriaProductoEntity = await this.categoriaProductosRepository.findOne({
      where: { id },
    });
    if (!categoriaPersistida)
      throw new ExcepcionNegocio(
        'Categoría de productos no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    return await this.categoriaProductosRepository.save({
      ...categoriaPersistida,
      ...categoriaProductos,
    });
  }

  async delete(id: number) {
    const categoriaProductos: CategoriaProductoEntity = await this.categoriaProductosRepository.findOne({
      where: { id },
    });
    if (!categoriaProductos)
      throw new ExcepcionNegocio(
        'Categoría de productos no encontrada',
        ErrorNegocio.NOT_FOUND,
      );

    await this.categoriaProductosRepository.remove(categoriaProductos);
  }
}
