import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WellsService } from './wells.service';
import { CreateWellDto } from './dto/create-well.dto';

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

    }

    @Get(':id')
    async findWllById(@Param('id') id:string){
        
    }
}
