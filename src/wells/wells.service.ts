import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity';
import { Repository } from 'typeorm';
import { CreateWellDto } from './dto/create-well.dto';
import { UsersService } from 'src/users/users.service';
import customMessage from 'src/shared/responses/customMessage.response';
import { SerializedWell } from './types/serializedWell';
import { UpdateUserOwnershipDto } from './dto/updateOwnership-well.dto';
import InternalServerExcp from 'src/shared/errors/internalServer.error';

@Injectable()
export class WellsService {
    constructor(
        @InjectRepository(Wells) private readonly wellRepository: Repository<Wells>,
        private readonly userService: UsersService
    ) { }

    async createWell({ ordinance, userId }: CreateWellDto) {

        if (await this.getOneByOrdinance(ordinance)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Já existe um poço com esta portaria.', {})
            );
        }

        if (!userId) {
            try {
                const newWell = this.wellRepository.create({ ordinance });
                await this.wellRepository.save(newWell);

                return customMessage(HttpStatus.OK, 'Poço criado com sucesso!', {})
            } catch (error) {
                InternalServerExcp(error);
            }
        }

        try {
            const user = await this.userService.getUserById(userId);
            const newWell = this.wellRepository.create({ ordinance, userId: user.id, hasActiveUser: true });

            await this.wellRepository.save(newWell);
            return customMessage(HttpStatus.OK, 'Poço criado com sucesso!', {})

        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findAllWells() {
        try {
            const wells: Array<Wells> = await this.wellRepository.find();
            return customMessage(
                HttpStatus.OK,
                'Lista de todos os poços',
                wells.map((well) => new SerializedWell(well))
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findWellById(id: string) {

        const well = await this.getOneWell(id);

        try {
            return customMessage(
                HttpStatus.OK,
                `Poço ${id}`,
                new SerializedWell(well)
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async getOneWell(id: string) {
        var well: Wells = new Wells();

        try {
            well = await this.wellRepository.findOneBy({ id })
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        return well;
    }


    async listWellsByUser(userId: string) {
        const user = await this.userService.getUserById(userId);

        try {
            const userWells: Array<Wells> = await this.wellRepository.find({ where: [{ userId: user.id }] });
            return customMessage(
                HttpStatus.OK,
                ("Poços do proprietário: " + userId),
                userWells.map((well) => new SerializedWell(well)))

        } catch (error) {            
            InternalServerExcp(error);
        }
    }


    async updateUserOwnership(id: string, updateUserOwnershipDto: UpdateUserOwnershipDto) {

        const well = await this.getOneWell(id);
        if (well.hasActiveUser) {
            throw new BadRequestException(customMessage(
                HttpStatus.BAD_REQUEST, 'Este poço já possui proprietário', {}
            ))
        }

        try {
            await this.wellRepository.update(id, updateUserOwnershipDto);
            return customMessage(HttpStatus.OK, "Propriedade do poço alterada com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async getOneByOrdinance(ordinance: string) {
        try {
            return await this.wellRepository.findOneBy({ ordinance });
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findWellByOrdinance(ordinance: string) {
        const well = await this.getOneByOrdinance(ordinance);

        if (!well.hasActiveUser) {
            return customMessage(
                HttpStatus.OK,
                'Poço com portaria nº: ' + ordinance,
                new SerializedWell(well)
            )
        }
        if (well.hasActiveUser) {
            return customMessage(
                HttpStatus.OK,
                'Poço com portaria nº: ' + ordinance + " já possui responsável cadastrado.",
                {}
            )
        }
    }
}
