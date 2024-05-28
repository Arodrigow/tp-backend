import { Exclude } from "class-transformer";

export class SerializedWell{

    id: string;
    supram:string;
    muni:string;
    ordinance: number;
    LON: number;
    LAT: number;
    NE: number;
    ND: number;
    vaz: number;
    tCap: number;
    profPc: number;
    diaPcmm: number;
    modUso: string;
    finUso: string;
    hasActiveUser: boolean;
    userId: string;
    tipoReg: string;
    dataVenc: Date;
    situ:string;
    updatedAt: Date;
    
    @Exclude()
    createdAt:Date;
    
    @Exclude()
    deletedAt:Date;

    constructor(partial: Partial<SerializedWell>){
        Object.assign(this, partial);
    }
}