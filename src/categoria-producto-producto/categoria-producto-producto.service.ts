/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CategoriaProductoEntity } from '../categoria-producto/categoria-producto.entity';
import { ProductoEntity } from '../producto/producto.entity';

@Injectable()
export class CategoriaProductoProductoService {
    constructor(
      @InjectRepository(ProductoEntity)
      private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(CategoriaProductoEntity)
        private readonly CategoriaProductoRepository: Repository<CategoriaProductoEntity>
     

    ) {}

    async agregarProductoCategoriaProducto(idCategoriaProducto: number, idProducto: number): Promise<CategoriaProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND);
       
        const categoriaProducto: CategoriaProductoEntity = await this.CategoriaProductoRepository.findOne({where: {id: idCategoriaProducto}, relations: ["productos"] }) 
        if (!categoriaProducto)
          throw new ExcepcionNegocio("La categoria de producto con el id dado no existe", ErrorNegocio.NOT_FOUND);
     
        categoriaProducto.productos = [...categoriaProducto.productos, producto];
        return await this.CategoriaProductoRepository.save(categoriaProducto);
      }
     
    async obtenerProductosPorIdCategoriaProductoidProducto(idCategoriaProducto: number, idProducto: number): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        const categoriaProducto: CategoriaProductoEntity = await this.CategoriaProductoRepository.findOne({where: {id: idCategoriaProducto}, relations: ["productos"]}); 
        if (!categoriaProducto)
          throw new ExcepcionNegocio("La categoria de producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
    
        const culturaProducto: ProductoEntity = categoriaProducto.productos.find(e => e.id === producto.id);
    
        if (!culturaProducto)
          throw new ExcepcionNegocio("El producto dado no está asociado a la categoria de producto dada", ErrorNegocio.PRECONDITION_FAILED)
    
        return culturaProducto;
    }
     
    async obtenerProductosPorIdCategoriaProducto(idCategoriaProducto: number): Promise<ProductoEntity[]> {
        const categoriaProducto: CategoriaProductoEntity = await this.CategoriaProductoRepository.findOne({where: {id: idCategoriaProducto}, relations: ["productos"]});
        if (!categoriaProducto)
          throw new ExcepcionNegocio("La categoria de producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        return categoriaProducto.productos;
    }
     
    async asociarProductosCategoriaProducto(idCategoriaProducto: number, productos: ProductoEntity[]): Promise<CategoriaProductoEntity> {
        const categoriaProducto: CategoriaProductoEntity = await this.CategoriaProductoRepository.findOne({where: {id: idCategoriaProducto}, relations: ["productos"]});
     
        if (!categoriaProducto)
          throw new ExcepcionNegocio("La categoria de producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
          if (!producto)
            throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
        }
     
        categoriaProducto.productos = productos;
        return await this.CategoriaProductoRepository.save(categoriaProducto);
      }
     
    async eliminarProductoCategoriaProducto(idCultura: number, idProducto: number){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const categoriaProducto: CategoriaProductoEntity = await this.CategoriaProductoRepository.findOne({where: {id: idCultura}, relations: ["productos"]});
        if (!categoriaProducto)
          throw new ExcepcionNegocio("La categoria de producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const culturaProducto: ProductoEntity = categoriaProducto.productos.find(e => e.id === producto.id);
     
        if (!culturaProducto)
            throw new ExcepcionNegocio("El producto dado no está asociado a la categoria de producto dada", ErrorNegocio.PRECONDITION_FAILED)

        categoriaProducto.productos = categoriaProducto.productos.filter(e => e.id !== idProducto);
        await this.CategoriaProductoRepository.save(categoriaProducto);
    }   
}