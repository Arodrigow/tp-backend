import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { CreateMonitoringDto } from './dto/create-monitoring.dto';
import { UpdateMonitoringDto } from './dto/update-monitoring.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/roles.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('monitoring')
export class MonitoringController {
    constructor(
        private readonly monitoringService: MonitoringService
    ){}

    
    @Roles(Role.USER, Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Post(':wellId')
    async createEntry(@Param('wellId') wellId:string, @Body() createMonitoringDto: CreateMonitoringDto){
        return await this.monitoringService.createEntry(wellId, createMonitoringDto);
    }

    @Patch(':wellId/:id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    async updateEntry(@Param('wellId') wellId:string, @Param('id') id:number, @Body() updateMonitoringDto: UpdateMonitoringDto){
        return await this.monitoringService.updateEntry(wellId, id, updateMonitoringDto);
    }
}
