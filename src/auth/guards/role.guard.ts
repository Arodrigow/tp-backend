import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/roles.enum";
import { ROLE_KEY } from "../decorator/roles.decorator";
import { TokenDto } from "../dto/token.dto";
import { AccessService } from "src/access/access.service";

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector,
        private readonly accessService: AccessService
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass()
        ]);        
        const request = context.switchToHttp().getRequest();
        const token = request['user'] as TokenDto

        for(let role of requiredRoles){
            const result = this.accessService.isAuthorized({
                requiredRole: role,
                currentRole: token.role
            });
            if(result){
                return true
            }
        }
        return false;
    }
}