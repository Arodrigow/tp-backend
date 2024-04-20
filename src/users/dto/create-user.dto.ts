import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateUserDto{

    @IsString()
    readonly name: string;

    @IsString()
    readonly password: string;

    @IsNumber()
    readonly cpf: number;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly phone_number: string;
}