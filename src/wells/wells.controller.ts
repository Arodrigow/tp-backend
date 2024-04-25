import { Body, ClassSerializerInterceptor, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { WellsService } from './wells.service';
import { CreateWellDto } from './dto/create-well.dto';
import { UpdateUserOwnershipDto } from './dto/updateOwnership-well.dto';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('wells')
export class WellsController {

    constructor(
        private readonly wellService:WellsService
    ){}

    @Post()
    async craeteWell(@Body() createWellDto: CreateWellDto){
        return await this.wellService.createWell(createWellDto);
    }

    @Get()
    async findAll(){
        return await this.wellService.findAllWells();
    }
    
    @Get(':id')
    async findWllById(@Param('id') id:string){
        return await this.wellService.findWellById(id);
    }

    @Get('ordinance/:ordinance')
    async findWellByOrdinance(@Param('ordinance') ordinance:string){
        return await this.wellService.findWellByOrdinance(ordinance);
    }

    @Get('user/:userId')
    async listWellsByUser(@Param('userId') userId: string){
        return await this.wellService.listWellsByUser(userId);
    }

    @Patch(':id')
    async updateUserOwnership(@Param('id') id:string, @Body() updateUserOwnershipDto:UpdateUserOwnershipDto){
        return await this.wellService.updateUserOwnership(id, updateUserOwnershipDto);
    }
}
