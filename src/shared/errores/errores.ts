/* eslint-disable prettier/prettier */
export function ExcepcionNegocio(mensaje: string, tipo: number) {
    this.mensaje = mensaje;
    this.type = tipo;
}

export enum ErrorNegocio {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
}
