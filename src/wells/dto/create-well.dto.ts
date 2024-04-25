import { IsNotEmpty } from "class-validator";
import { Users } from "src/users/entities/user.entity";

export class CreateWellDto{

    userId?: string
    hasActiveUser?: boolean;
}