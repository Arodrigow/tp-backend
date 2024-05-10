import { IsEmail, IsNotEmpty, IsNumber, IsString, Validate } from "class-validator";
import { CPForCNPJ } from "src/shared/validators/document.validator";

export class CreateUserDto{

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
}