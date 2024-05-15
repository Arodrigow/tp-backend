import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Activities } from './entities/activities.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import InternalServerExcp from 'src/shared/errors/internalServer.error';
import customMessage from 'src/shared/responses/customMessage.response';
import { getOrder, getWhere } from 'src/search/helpers/queryHelper';
import { Filtering } from 'src/search/decorators/filterParams.decorator';
import { Sorting } from 'src/search/decorators/sortParams.decorator';
import { Pagination } from 'src/search/decorators/paginationParams.decorator';
import { SerializedActivity } from './types/serializedActivity';

@Injectable()
export class ActivitiesService {
    constructor(
        @InjectRepository(Activities) private readonly activitiesRepository: Repository<Activities>
    ) { }

    async createActivity(createActivityDto: CreateActivityDto) {
        try {
            const activity = this.activitiesRepository.create({ ...createActivityDto })
            await this.activitiesRepository.save(activity);
            return customMessage(
                HttpStatus.OK,
                'Nova atividade criada com sucesso.',
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }
    async findAll() {
        try {
            const activities = await this.activitiesRepository.find();
            return customMessage(
                HttpStatus.OK,
                'Lista de atividades registradas: ',
                activities
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findActivity(id: string) {
        const activity = await this.getActivityById(id);
        if(!activity){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Atividade especificada não foi encontrada", {})
            )
        }

        return customMessage(HttpStatus.OK,
            `Atividade de Processo nº: ${activity.processo}`,
            new SerializedActivity(activity)
        )
    }
    async adminFindActivity(id: string) {
        var activity: Activities = new Activities()
        try {
            activity = await this.activitiesRepository.findOne({
                withDeleted: true,
                where: { id }
            })
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!activity) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Atividade especificada não existe.", {})
            )
        }

        try {
            return customMessage(
                HttpStatus.OK,
                `Usuário do ID: ${id}`,
                activity
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async updateActivity(id: string, updateActivityDto: UpdateActivityDto) {
        const activity = await this.getActivityById(id);
        if(!activity){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Atividade especificada não foi encontrada", {})
            )
        }

        try {
            await this.activitiesRepository.update(activity.id, {...updateActivityDto})
            return customMessage(HttpStatus.OK, "Atividade atualizada com sucesso.", {})
        } catch (error) {
            InternalServerExcp(error)
        }

    }
    async deleteActivity(id: string) {
        const activity = await this.getActivityById(id);
        if(!activity){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Atividade especificada não foi encontrada", {})
            )
        }
        try {
            await this.activitiesRepository.softRemove(activity);
            return customMessage(HttpStatus.OK,
                `Atividade - Processo nº: ${activity.processo} deletada com sucesso`,
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }
    async restoreActivity(id: string) {
        const activity = await this.activitiesRepository.findOne({withDeleted: true, where:{id,deletedAt: Not(IsNull())}});
        if(!activity){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Atividade especificada não existe ou não foi deletada", {})
            )
        }
        try {
            await this.activitiesRepository.restore(id);
            return customMessage(HttpStatus.OK,
                `Atividade - Processo nº: ${activity.processo} restaurada com sucesso`,
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async getActivityById(id: string) {
        var activity: Activities = new Activities();

        try {
            activity = await this.activitiesRepository.findOneBy({ id });
        } catch (error) {
            InternalServerExcp(error);
        }

        return activity;
    }

    public async searchActivities(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ) {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.activitiesRepository.findAndCount({
            where,
            order,
            take: limit,
            skip: offset,
        });

        return {
            totalItems: total,
            items: languages.map(language => new SerializedActivity(language)),
            page,
            size
        };
    }

    public async adminSearchActivities(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ) {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.activitiesRepository.findAndCount({
            withDeleted:true,
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
