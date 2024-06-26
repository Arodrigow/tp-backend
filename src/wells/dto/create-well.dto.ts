export class CreateWellDto {

    supram?:string;
    muni?:string;
    LON?: number;
    LAT?: number;
    ordinance?: number;
    NE?: number;
    ND?: number;
    vaz?: number;
    tCap?: number;
    profPc?: number;
    diaPcmm?: number;
    modUso?: string;
    finUso?: string;
    userId?: string
    hasActiveUser?: boolean;
    tipoReg?: string;
    dataVenc?: Date;
    dataInic?: Date;
    situ?:string;
}