/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorNegocio, ExcepcionNegocio } from '../shared/errores/errores';
import { Repository } from 'typeorm';
import { CulturaGastronomicaEntity } from './../cultura-gastronomica/cultura-gastronomica.entity';
import { PaisEntity } from './../pais/pais.entity';

@Injectable()
export class PaisCulturaGastronomicaService {
    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ) { }


    async obtenerCulturasPorIdPais(idPais: number): Promise<CulturaGastronomicaEntity[]> {
        const pais: PaisEntity = await this.paisRepository.findOne({ where: { id: idPais }, relations: ["culturasGastronomicas"] });
        if (!pais)
            throw new ExcepcionNegocio("El país con el id dado no existe", ErrorNegocio.NOT_FOUND)

        return pais.culturasGastronomicas;
    }


}