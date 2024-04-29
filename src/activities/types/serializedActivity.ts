import { Exclude } from "class-transformer";

export class SerializedActivity{
    processo: string;
    munSolic: string;
    codAtivPrim: string;
    riscoAr: string;
    riscoAgua: string;
    riscoSolo: string;
    riscoTotal: string;
    list: string;
    descAtivPrim: string;
    classe: number;
    fatLocRes: number;
    modLic: string;
    faseLic: string;
    undAnalis: string;
    lat: number;
    long: number;
    dataSla: number;
    vigLicAng: number;

    @Exclude()
    createdAt:Date;
    
    @Exclude()
    updatedAt: Date;

    @Exclude()
    deletedAt:Date;

    constructor(partial: Partial<SerializedActivity>){
        Object.assign(this, partial);
    }
}