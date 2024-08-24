import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';

@Injectable()
export class ProductoService {
  cacheKey = 'productos';

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findAll(): Promise<ProductoEntity[]> {
    const cached: ProductoEntity[] = await this.cacheManager.get<
      ProductoEntity[]
    >(this.cacheKey);

    if (!cached) {
      const productos: ProductoEntity[] = await this.productoRepository.find({
        relations: ['culturaGastronomica', 'categoriaProducto'],
      });
      await this.cacheManager.set(this.cacheKey, productos);
      return productos;
    }
    return cached;
  }

  async findOne(id: number): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
      relations: ['culturaGastronomica', 'categoriaProducto'],
    });
    if (!producto)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    return await this.productoRepository.save(producto);
  }

  async update(id: number, producto: ProductoEntity): Promise<ProductoEntity> {
    const productoPersistido: ProductoEntity =
      await this.productoRepository.findOne({
        where: { id },
      });
    if (!productoPersistido)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    return await this.productoRepository.save({
      ...productoPersistido,
      ...producto,
    });
  }

  async delete(id: number) {
    const producto: ProductoEntity = await this.productoRepository.findOne({
      where: { id },
    });
    if (!producto)
      throw new ExcepcionNegocio(
        'Producto no encontrado',
        ErrorNegocio.NOT_FOUND,
      );

    await this.productoRepository.remove(producto);
  }
}
