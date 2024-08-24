/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { RecetaEntity } from './../receta/receta.entity';

@Injectable()
export class CulturaGastronomicaRecetaService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
     
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ) {}

    async agregarRecetaCulturaGastronomica(idCultura: number, idReceta: number): Promise<CulturaGastronomicaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: idReceta}});
        if (!receta)
          throw new ExcepcionNegocio("La receta con el id dado no existe", ErrorNegocio.NOT_FOUND);
       
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises", "productos", "recetas", "restaurantes"] }) 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
     
        cultura.recetas = [...cultura.recetas, receta];
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async obtenerRecetasPorIdCulturaidReceta(idCultura: number, idReceta: number): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: idReceta}});
        if (!receta)
          throw new ExcepcionNegocio("La receta con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["recetas"]}); 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
    
        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.id === receta.id);
    
        if (!culturaReceta)
          throw new ExcepcionNegocio("La receta dada no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)
    
        return culturaReceta;
    }
     
    async obtenerRecetasPorIdCultura(idCultura: number): Promise<RecetaEntity[]> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["recetas"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        return cultura.recetas;
    }
     
    async asociarRecetasCulturaGastronomica(idCultura: number, recetas: RecetaEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["recetas"]});
     
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        for (let i = 0; i < recetas.length; i++) {
          const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: recetas[i].id}});
          if (!receta)
            throw new ExcepcionNegocio("La receta con el id dado no existe", ErrorNegocio.NOT_FOUND)
        }
     
        cultura.recetas = recetas;
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async eliminarRecetaCultura(idCultura: number, idReceta: number){
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {id: idReceta}});
        if (!receta)
          throw new ExcepcionNegocio("La receta con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["recetas"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.id === receta.id);
     
        if (!culturaReceta)
            throw new ExcepcionNegocio("La receta dada no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)

        cultura.recetas = cultura.recetas.filter(e => e.id !== idReceta);
        await this.culturaGastronomicaRepository.save(cultura);
    }   
}