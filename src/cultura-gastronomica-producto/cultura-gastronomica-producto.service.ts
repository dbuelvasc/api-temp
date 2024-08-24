/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from '../cultura-gastronomica/cultura-gastronomica.entity';
import { ProductoEntity } from '../producto/producto.entity';

@Injectable()
export class CulturaGastronomicaProductoService {
    constructor(
      @InjectRepository(ProductoEntity)
      private readonly productoRepository: Repository<ProductoEntity>,

        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>
     

    ) {}

    async agregarProductoCulturaGastronomica(idCultura: number, idProducto: number): Promise<CulturaGastronomicaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND);
       
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises", "productos", "recetas", "restaurantes"] }) 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
     
        cultura.productos = [...cultura.productos, producto];
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async obtenerProductosPorIdCulturaidProducto(idCultura: number, idProducto: number): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["productos"]}); 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
    
        const culturaProducto: ProductoEntity = cultura.productos.find(e => e.id === producto.id);
    
        if (!culturaProducto)
          throw new ExcepcionNegocio("El producto dado no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)
    
        return culturaProducto;
    }
     
    async obtenerProductosPorIdCultura(idCultura: number): Promise<ProductoEntity[]> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["productos"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        return cultura.productos;
    }
     
    async asociarProductosCulturaGastronomica(idCultura: number, productos: ProductoEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["productos"]});
     
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: productos[i].id}});
          if (!producto)
            throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
        }
     
        cultura.productos = productos;
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async eliminarProductoCultura(idCultura: number, idProducto: number){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id: idProducto}});
        if (!producto)
          throw new ExcepcionNegocio("El producto con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["productos"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const culturaProducto: ProductoEntity = cultura.productos.find(e => e.id === producto.id);
     
        if (!culturaProducto)
            throw new ExcepcionNegocio("El producto dado no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)

        cultura.productos = cultura.productos.filter(e => e.id !== idProducto);
        await this.culturaGastronomicaRepository.save(cultura);
    }   
}