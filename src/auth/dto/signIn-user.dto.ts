import { IsNotEmpty } from "class-validator";

export class SignInUserDto{
    
    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly cpf: string;
}