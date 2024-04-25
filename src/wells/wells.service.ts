import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity';
import { Repository } from 'typeorm';
import { CreateWellDto } from './dto/create-well.dto';
import { UsersService } from 'src/users/users.service';
import customMessage from 'src/shared/responses/customMessage.response';

@Injectable()
export class WellsService {
    constructor(
        @InjectRepository(Wells) private readonly wellRepository: Repository<Wells>,
        private readonly userService: UsersService
    ) { }

    async createWell({ userId }: CreateWellDto) {

        if(!userId){
            const newWell = this.wellRepository.create();
            await this.wellRepository.save(newWell);

            return customMessage(HttpStatus.OK, 'Poço criado com sucesso!', {})
        }

            const user = await this.userService.getUserById(userId);
            const newWell = this.wellRepository.create({userId: user.id, hasActiveUser: true});

            await this.wellRepository.save(newWell);
            return customMessage(HttpStatus.OK, 'Poço criado com sucesso!', {})
    }
}
