import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ShapesData } from './entities/shape.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import InternalServerExcp from 'src/shared/errors/internalServer.error';
import customMessage from 'src/shared/responses/customMessage.response';

@Injectable()
export class ShapesService {


    constructor(
        @InjectRepository(ShapesData) private readonly shapesRepository: Repository<ShapesData>,
    ) { }

    async getShapeByName(name: string) {
        var shape: ShapesData = new ShapesData()

        try {
            shape = await this.shapesRepository.findOne({ where: { name } })
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!shape) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Shape especificado não existe.", {})
            )
        }

        return customMessage(
            HttpStatus.OK,
            ("Shape name: " + shape.name),
            shape
        )
    }
}
