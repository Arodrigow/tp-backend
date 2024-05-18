import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Role } from "src/auth/enums/roles.enum";

export class CreateAdminUserDto{

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;
    
    @IsNotEmpty()
    //@Validate(CPForCNPJ)
    readonly cpf: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly phone_number: string;

    readonly role: Role;
}