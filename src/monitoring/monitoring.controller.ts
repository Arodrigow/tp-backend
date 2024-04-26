import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';

@Controller('monitoring')
export class MonitoringController {
    constructor(
        private readonly monitoringService: MonitoringService
    ){}

    @Post(':wellId')
    async createEntry(@Param('wellId') wellId:string, @Body() createMonitoringDto: CreateMonitoringDto){
        return await this.monitoringService.createEntry(wellId, createMonitoringDto);
    }

    @Patch(':wellId/:id')
    async updateEntry(@Param('wellId') wellId:string, @Param('id') id:number, @Body() updateMonitoringDto: UpdateMonitoringDto){
        return await this.monitoringService.updateEntry(wellId, id, updateMonitoringDto);
    }
}
