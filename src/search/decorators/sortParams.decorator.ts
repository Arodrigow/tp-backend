import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

export interface Sorting {
    property: string;
    direction: string;
}

type MyRequest = FastifyRequest<
    {
        Querystring: {
            sort: string
        }
    }>

export const SortingParams = createParamDecorator((validParams, ctx: ExecutionContext): Sorting => {
    const req: MyRequest = ctx.switchToHttp().getRequest();
    const sort = decodeURIComponent(req.query.sort as string);
    
    if (!sort) return null;
    
    // check if the valid params sent is an array
    if (typeof validParams != 'object') throw new BadRequestException('Invalid sort parameter - not object');

    // check the format of the sort query param
    const sortPattern = /^([a-zA-Z0-9]+):(asc|desc)$/;
    if (!sort.match(sortPattern)) throw new BadRequestException('Invalid sort parameter - no match');

    // extract the property name and direction and check if they are valid
    const [property, direction] = sort.split(':');
    if (!validParams.includes(property)) throw new BadRequestException(`Invalid sort property: ${property}`);

    return { property, direction };
});