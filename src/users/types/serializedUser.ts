import { Exclude } from "class-transformer";

export class SerializedUser {

    id: string;
    name: string;
    cpf:string;
    email:string;
    phone_number:string;
    deletedAt:Date;

    @Exclude()
    password:string;

    @Exclude()
    createdAt:Date;

    @Exclude()
    updatedAt:Date;

    constructor(partial: Partial<SerializedUser>){
        Object.assign(this, partial);
    }
}