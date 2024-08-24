/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './cultura-gastronomica.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaGastronomicaService {

    cacheKey: string = "culturas";

    constructor(
        @InjectRepository(CulturaGastronomicaEntity)
        private readonly culturaGastronomicaRepository: Repository<CulturaGastronomicaEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<CulturaGastronomicaEntity[]> {

        const cached: CulturaGastronomicaEntity[] = await this.cacheManager.get<CulturaGastronomicaEntity[]>(this.cacheKey);
      
        if(!cached){
            const culturas: CulturaGastronomicaEntity[] = await this.culturaGastronomicaRepository.find({ relations: ["paises", "productos", "recetas", "restaurantes"] });
            await this.cacheManager.set(this.cacheKey, culturas);
            return culturas;
        }
 
        return cached;

    }

    async findOne(id: number): Promise<CulturaGastronomicaEntity> {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where: {id}, relations: ["paises", "productos", "recetas", "restaurantes"] });
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
    
        return cultura;
    }
    
    async create(cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        return await this.culturaGastronomicaRepository.save(cultura);
    }

    async update(id: number, cultura: CulturaGastronomicaEntity): Promise<CulturaGastronomicaEntity> {
        const persistedMuseum: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!persistedMuseum)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
        
        return await this.culturaGastronomicaRepository.save({...persistedMuseum, ...cultura});
    }

    async delete(id: number) {
        const cultura: CulturaGastronomicaEntity = await this.culturaGastronomicaRepository.findOne({where:{id}});
        if (!cultura)
          throw new ExcepcionNegocio("La cultura gastronómica con el id dado no existe", ErrorNegocio.NOT_FOUND);
      
        await this.culturaGastronomicaRepository.remove(cultura);
    }
}