import { CanActivate, ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {FastifyRequest} from "fastify"
import customMessage from "src/shared/responses/customMessage.response";


@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(
                customMessage(HttpStatus.UNAUTHORIZED, 'Você não tem autorização para acessar esta página',{})
            )
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret:process.env.SECRET
                }
            );
            request['user'] = payload
        } catch (error) {
            throw new UnauthorizedException(
                customMessage(HttpStatus.UNAUTHORIZED, 'Você não tem autorização para acessar esta página',{})
            )            
        }
        return true;
    }

    private extractTokenFromHeader(request: FastifyRequest):string{
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined
    }
}
