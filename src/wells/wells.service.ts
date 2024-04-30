import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateWellDto } from './dto/create-well.dto';
import { UsersService } from 'src/users/users.service';
import customMessage from 'src/shared/responses/customMessage.response';
import { SerializedWell } from './types/serializedWell';
import { UpdateUserOwnershipDto } from './dto/updateOwnership-well.dto';
import InternalServerExcp from 'src/shared/errors/internalServer.error';
import { UpdateWellDto } from './dto/update-well.dto';
import { Sorting } from '../search/decorators/sortParams.decorator';
import { Filtering } from '../search/decorators/filterParams.decorator';
import { Pagination } from '../search/decorators/paginationParams.decorator';
import { PaginatedResource } from '../search/dto/paginated-resources.dto';
import { getOrder, getWhere } from '../search/helpers/queryHelper';

@Injectable()
export class WellsService {
    constructor(
        @InjectRepository(Wells) private readonly wellRepository: Repository<Wells>,
        private readonly userService: UsersService
    ) { }

    async createWell(createWellDto: CreateWellDto) {

        if (await this.getWellByOrdinance(createWellDto.ordinance)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Já existe um poço com esta portaria.', {})
            );
        }

        if (!createWellDto.userId) {
            try {
                const newWell = this.wellRepository.create({...createWellDto});
                await this.wellRepository.save(newWell);

                return customMessage(HttpStatus.OK, 'Poço criado com sucesso!', {})
            } catch (error) {
                InternalServerExcp(error);
            }
        }

        try {
            const user = await this.userService.getUserById(createWellDto.userId);
            const newWell = this.wellRepository.create({ ...createWellDto, hasActiveUser: true });

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


    async updateUserOwnership(ordinance: number, {userId, hasActiveUser}: UpdateUserOwnershipDto) {

        const well = await this.getWellByOrdinance(ordinance);
        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        if (well.hasActiveUser) {
            throw new BadRequestException(customMessage(
                HttpStatus.BAD_REQUEST, 'Este poço já possui proprietário', {}
            ))
        }

        try {
            await this.wellRepository.update(well.id, {userId, hasActiveUser});
            return customMessage(HttpStatus.OK, "Propriedade do poço alterada com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async updateWell(ordinance: number, updateWellDto: UpdateWellDto){
        const well = await this.getWellByOrdinance(ordinance);
        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }
        
        await this.userService.getUserById(updateWellDto.userId);

        try {
            await this.wellRepository.update(well.id, {...updateWellDto});
            return customMessage(HttpStatus.OK, "Poço atualizado com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async getWellByOrdinance(ordinance: number) {
        try {
            return await this.wellRepository.findOneBy({ordinance});
        } catch (error) {
            InternalServerExcp(error);
        }

    }

    async findWellByOrdinance(ordinance: number) {
        const well = await this.getWellByOrdinance(ordinance);

        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        try {
            return customMessage(HttpStatus.OK, 
                `Poço - Portaria ${ordinance}`, 
                new SerializedWell(well)
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findWellByOrdinanceNotOwn(ordinance: number) {
        const well = await this.getWellByOrdinance(ordinance);

        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        try {
            if (!well.hasActiveUser) {
                return customMessage(
                    HttpStatus.OK,
                    'Poço com portaria nº: ' + ordinance,
                    new SerializedWell(well)
                )
            }
            if (well.hasActiveUser) {
                return customMessage(
                    HttpStatus.CONFLICT,
                    'Poço com portaria nº: ' + ordinance + " já possui responsável cadastrado.",
                    {}
                )
            }

        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async deleteWell(ordinance:number){
        const well = await this.getWellByOrdinance(ordinance);

        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }
        try {
            await this.wellRepository.softDelete(well)
            return customMessage(HttpStatus.OK,
                "Poço deletado com sucesso",
                {}
            )
            
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async restoreWell(ordinance: number){
        const well = await this.wellRepository.findOne({withDeleted: true, where:{ordinance,deletedAt: Not(IsNull())}});        
        if(!well){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe ou não foi deletado.", {})
            )
        }
        try {
            await this.wellRepository.restore(well.id);
            return customMessage(HttpStatus.OK,
                "Poço recuperado com sucesso",
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    public async searchWells(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ) {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.wellRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: offset,
        });

        return {
            totalItems: total,
            items: languages,
            page,
            size
        };
    }
}
