import { Exclude } from "class-transformer";

export class AdminSerializedUser {

    id: string;
    name: string;
    email:string;
    phone_number:string;
    deletedAt:Date;
    cpf:string;
    createdAt:Date;
    updatedAt:Date;

    @Exclude()
    password:string;

    constructor(partial: Partial<AdminSerializedUser>){
        Object.assign(this, partial);
    }
}