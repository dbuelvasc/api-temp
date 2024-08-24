/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from './../pais/pais.entity';

@Injectable()
export class CulturaGastronomicaPaisService {
    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
     
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ) {}

    async agregarPaisCulturaGastronomica(idCultura: number, idPais: number): Promise<CulturaGastronomicaEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: idPais}});
        if (!pais)
          throw new ExcepcionNegocio("El país con el id dado no existe", ErrorNegocio.NOT_FOUND);
       
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises", "productos", "recetas", "restaurantes"] }) //relations: ["paises", "productos", "restaurantes", "restaurantes"] }) 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
     
        cultura.paises = [...cultura.paises, pais];
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async obtenerPaisesPorIdCulturaIdPais(idCultura: number, idPais: number): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: idPais}});
        if (!pais)
          throw new ExcepcionNegocio("El país con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises"]}); 
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
    
        const culturaPais: PaisEntity = cultura.paises.find(e => e.id === pais.id);
    
        if (!culturaPais)
          throw new ExcepcionNegocio("El país dado no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)
    
        return culturaPais;
    }
     
    async obtenerPaisesPorIdCultura(idCultura: number): Promise<PaisEntity[]> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
        
        return cultura.paises;
    }
     
    async asociarPaisesCulturaGastronomica(idCultura: number, paises: PaisEntity[]): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises"]});
     
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        for (let i = 0; i < paises.length; i++) {
          const pais: PaisEntity = await this.paisRepository.findOne({where: {id: paises[i].id}});
          if (!pais)
            throw new ExcepcionNegocio("El país con el id dado no existe", ErrorNegocio.NOT_FOUND)
        }
     
        cultura.paises = paises;
        return await this.culturaGastronomicaRepository.save(cultura);
      }
     
    async eliminarPaisCultura(idCultura: number, idPais: number){
        const pais: PaisEntity = await this.paisRepository.findOne({where: {id: idPais}});
        if (!pais)
          throw new ExcepcionNegocio("El país con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id: idCultura}, relations: ["paises"]});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND)
     
        const culturaPais: PaisEntity = cultura.paises.find(e => e.id === pais.id);
     
        if (!culturaPais)
            throw new ExcepcionNegocio("El país dado no está asociado a la cultura dada", ErrorNegocio.PRECONDITION_FAILED)

        cultura.paises = cultura.paises.filter(e => e.id !== idPais);
        await this.culturaGastronomicaRepository.save(cultura);
    }   
}