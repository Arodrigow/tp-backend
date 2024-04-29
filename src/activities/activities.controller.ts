import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { ActivitiesService } from './activities.service';
import { UpdateActivityDto } from './dto/update-activities.dto';

@Controller('activities')
export class ActivitiesController {

    constructor(
        private readonly activitiesService: ActivitiesService
    ){}

    @Post()
    async createActivity(@Body() createActivityDto: CreateActivityDto){
        return await this.activitiesService.createActivity(createActivityDto);
    }

    @Get()
    async findAll(){
        return await this.activitiesService.findAll();
    }

    @Get(':id')
    async findActivity(@Param('id') id:string){
        return await this.activitiesService.findActivity(id);
    }

    @Patch(':id')
    async updateActivity(@Param('id') id:string, @Body() updateActivityDto:UpdateActivityDto){
        return await this.activitiesService.updateActivity(id, updateActivityDto);
    }

    @Delete('delete/:id')
    async deleteActivity(@Param('id') id:string){
        return await this.activitiesService.deleteActivity(id);
    }

    @Patch('restore/:id')
    async restoreActivity(@Param('id') id:string){
        return await this.activitiesService.restoreActivity(id);
    }
}
