import { Exclude } from "class-transformer";

export class SerializedUser {

    id: string;
    name: string;
    cpf:string;
    email:string;
    phone_number:string;

    @Exclude()
    password:string;

    @Exclude()
    createdAt:Date;

    @Exclude()
    updatedAt:Date;

    @Exclude()
    deletedAt:Date;

    constructor(partial: Partial<SerializedUser>){
        Object.assign(this, partial);
    }
}