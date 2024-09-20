import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Monitoring } from './entities/monitoring.entity';
import { Repository } from 'typeorm';
import { WellsService } from 'src/wells/wells.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import customMessage from 'src/shared/responses/customMessage.response';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
import InternalServerExcp from 'src/shared/errors/internalServer.error';

@Injectable()
export class MonitoringService {
    constructor(
        @InjectRepository(Monitoring) private readonly monitRepository: Repository<Monitoring>,
        private readonly wellService: WellsService
    ) { }

    async createEntry(wellId: string, { flow, level, pumpTime, date }: CreateMonitoringDto) {
        const well = await this.wellService.getOneWell(wellId);
        const entries = await this.findListByWellId(wellId);

        for (let entry of entries) {
            if (new Date(entry.date).toLocaleDateString() === new Date(date.toString().replace(/-/g, '\/')).toLocaleDateString()) {
                throw new BadRequestException(
                    customMessage(HttpStatus.BAD_REQUEST, "Data já foi usada em outra entrada de monitoramento.", {})
                )
            }
        }

        try {
            const newEntry = new Monitoring();
            newEntry.flow = flow;
            newEntry.level = level;
            newEntry.pumpTime = pumpTime;
            newEntry.date = new Date(date);
            newEntry.date.setTime(newEntry.date.getTime() + (12 * 60 * 60 * 1000))
            newEntry.well = well;
            await this.monitRepository.save(newEntry);

        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async updateEntry(wellId: string, id: number, updateMonitoringDto: UpdateMonitoringDto) {
        const entry = await this.findOneEntryById(id);

        if (entry.wellId != wellId) {
            throw new ForbiddenException(
                customMessage(HttpStatus.FORBIDDEN, "Entrada especificada não pertence a este poço!", {})
            )
        }
        try {
            await this.monitRepository.update(entry.id, updateMonitoringDto);
            return customMessage(
                HttpStatus.OK,
                'Atualização da entrada realizada com sucesso',
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    private async findListByWellId(wellId: string) {
        var entries: Array<Monitoring>;

        try {
            entries = await this.monitRepository.find({ where: { wellId } });
        } catch (error) {
            InternalServerExcp(error);
        }

        return entries;
    }

    private async findOneEntryById(id: number) {
        var entry = new Monitoring();
        try {
            entry = await this.monitRepository.findOneBy({ id });
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!entry) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Entrada especificada não existe!", {})
            )
        }
        return entry;
    }

    async deleteEntry(id: number) {
        const entry = await this.findOneEntryById(id);

        try {
            await this.monitRepository.remove(entry);
        } catch (error) {
            InternalServerExcp(error)
        }
    }
}

