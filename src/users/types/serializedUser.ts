import { Exclude } from "class-transformer";
import { Role } from "src/auth/enums/roles.enum";

export class SerializedUser {

    id: string;
    name: string;
    email:string;
    phone_number:string;
    deletedAt:Date;
    cpf:string;
    role:Role;

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