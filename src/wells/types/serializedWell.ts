import { Exclude } from "class-transformer";

export class SerializedWell{

    id: string;
    LON: number;
    LAT: number;
    ordinance: number;
    NE: number;
    ND: number;
    statuspa: string;
    tipoUso: string;
    modUso: string;
    vaz: number;
    tCap: number;
    profPc: string;
    diaPcmm: string;
    finUso: string;
    tpoConsu: string;
    siglaCh: string;
    baciaFede: string;
    ueg: string;
    chNome: string;
    hasActiveUser: boolean;
    updatedAt: Date;


    @Exclude()
    userId: string;

    @Exclude()
    createdAt:Date;

    @Exclude()
    deletedAt:Date;

    constructor(partial: Partial<SerializedWell>){
        Object.assign(this, partial);
    }
}