import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import customMessage from 'src/shared/responses/customMessage.response';
import { comparePasswords } from 'src/shared/utils/bcrypt';
import { UsersService } from 'src/users/users.service';
import censorDocuments from './utils/censorDocuments';

@Injectable()
export class AuthService {    

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { 
    }

    async signIn(cpf: string, password: string): Promise<any> {
        const user = await this.userService.findByCPF(cpf);
        if (!user) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Usuário específicado não existe.", {})
            )
        }

        if (!(comparePasswords(password, user.password))) {
            throw new UnauthorizedException(
                customMessage(HttpStatus.UNAUTHORIZED, 'Senha incorreta', {})
            )
        }

        
        const payload = { sub: user.id, name:user.name, email: user.email, phone_number: user.phone_number, role:user.role, cpf: censorDocuments(user.cpf)};

        return customMessage(HttpStatus.CREATED, 'token created successfully', {
            ...payload,
            access_token: await this.jwtService.signAsync(payload,{expiresIn:24*60*60}),
        });
    }
}
