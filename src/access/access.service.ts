import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enums/roles.enum';

interface IsAuthorizedParams {
    currentRole: Role;
    requiredRole: Role;
  }

@Injectable()
export class AccessService {
    private hierarchies: Array<Map<string, number>> = [];
    private priority: number = 1;

    constructor() {
        this.buildRoles([Role.USER, Role.ADMIN]);
    }

    
    private buildRoles(roles: Role[]) {
        const hierarchy: Map<string, number> = new Map();
        roles.forEach((role) => {
          hierarchy.set(role, this.priority);
          this.priority++;
        });
        this.hierarchies.push(hierarchy);
      }

      public isAuthorized({ currentRole, requiredRole }: IsAuthorizedParams) {
        for (let hierarchy of this.hierarchies) {
          const priority = hierarchy.get(currentRole);
          const requiredPriority = hierarchy.get(requiredRole);
          if (priority && requiredPriority && priority >= requiredPriority) {
            return true;
          }
        }
        return false;
      }
}
