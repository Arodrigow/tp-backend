import { BadRequestException, ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wells } from './entities/well.entity';
import { In, IsNull, Not, Repository } from 'typeorm';
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
import { getOrder, getWhere } from '../search/helpers/queryHelper';

@Injectable()
export class WellsService {
    constructor(
        @InjectRepository(Wells) private readonly wellRepository: Repository<Wells>,
        private readonly userService: UsersService
    ) { }

    async createWell(createWellDto: CreateWellDto) {
        const wells = await this.getWellsByOrdinance(createWellDto.ordinance);
        
        if (wells.length > 0) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Já existe um poço com esta portaria.', {})
            );
        }

        if (!createWellDto.userId) {
            try {
                const newWell = this.wellRepository.create({ ...createWellDto });
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

    async getOneWell(id: string) {
        var well: Wells = new Wells();

        try {
            well = await this.wellRepository.findOne({where:{id}})
        } catch (error) {
            InternalServerExcp(error);
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


    async updateUserOwnership(wellId: string, { userId, hasActiveUser }: UpdateUserOwnershipDto) {

        const well = await this.getOneWell(wellId);
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
            await this.wellRepository.update(well.id, { userId, hasActiveUser });
            return customMessage(HttpStatus.OK, "Propriedade do poço alterada com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async updateWell(wellId: string, updateWellDto: UpdateWellDto) {
        const well = await this.getOneWell(wellId);
        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        await this.userService.getUserById(updateWellDto.userId);

        try {
            await this.wellRepository.update(well.id, { ...updateWellDto });
            return customMessage(HttpStatus.OK, "Poço atualizado com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async getWellsByOrdinance(ordinance: number) {
        try {
            return await this.wellRepository.find({where: {ordinance} });
        } catch (error) {
            InternalServerExcp(error);
        }

    }

    async adminFindWellById(wellId:string){
        let well: Wells = new Wells();
        try {
            well = await this.wellRepository.findOne({
                withDeleted:true,
                where:{id:wellId}
            })            
        } catch (error) {
            InternalServerExcp(error);
        }

        if(!well){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe.", {})
            )
        }

        try {
            return customMessage(
                HttpStatus.OK,
                `Usuário do ID: ${wellId}`,
                well
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findWellById(wellId?: string, wellIds?: string) {
        if (!!!wellIds) {
            const well = await this.getOneWell(wellId);

            if (!well) {
                throw new NotFoundException(
                    customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
                )
            }

            try {
                return customMessage(HttpStatus.OK,
                    `Poço - Portaria ${wellId}`,
                    new SerializedWell(well)
                )
            } catch (error) {
                InternalServerExcp(error);
            }
        }
        if (!!wellIds) {
            try {
                const strOrd = JSON.parse(wellIds);

                const wells = await this.wellRepository.find({where:{
                    id: In(strOrd)
                }})
                return customMessage(HttpStatus.OK,
                    `Lista de poços`,
                    wells.map(well => new SerializedWell(well))
                )
            } catch (error) {
                InternalServerExcp(error);                
            }
        }
    }

    async findWellByOrdinanceNotOwn(ordinance: number) {
        const wells = await this.getWellsByOrdinance(ordinance);

        if (!!!wells) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }

        try {
            let wellResponse: Wells[] = [];
            wells.map( well => {
                if (!well.hasActiveUser) {
                    wellResponse.push(well);
                }
            })
            if (wellResponse.length == 0) {
                return customMessage(HttpStatus.OK, 
                    'Não existem poços com esta Portaria sem usuário ativo',
                    {}    
                );
                
            }

            return customMessage(HttpStatus.OK, 
                'Lista de poços sem dono',
                wellResponse.map(well => new SerializedWell(well)));

        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async deleteWell(wellId: string) {
        const well = await this.getOneWell(wellId);

        if (!well) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Poço especificado não existe!", {})
            )
        }
        try {
            await this.wellRepository.softRemove(well);
            
            return customMessage(HttpStatus.OK,
                "Poço deletado com sucesso",
                {}
            )

        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async restoreWell(wellId: string) {
        const well = await this.wellRepository.findOne({ withDeleted: true, where: { id:wellId, deletedAt: Not(IsNull()) } });
        if (!well) {
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
            items: languages.map(well => new SerializedWell(well)),
            page,
            size
        };
    }

    public async adminSearchWells(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ) {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.wellRepository.findAndCount({
            withDeleted: true,
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
