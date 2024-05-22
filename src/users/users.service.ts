import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import customMessage from 'src/shared/responses/customMessage.response';
import { SerializedUser } from './types/serializedUser';
import { encodePassword } from 'src/shared/utils/bcrypt';
import InternalServerExcp from 'src/shared/errors/internalServer.error';
import { Pagination } from 'src/search/decorators/paginationParams.decorator';
import { Sorting } from 'src/search/decorators/sortParams.decorator';
import { Filtering } from 'src/search/decorators/filterParams.decorator';
import { getOrder, getWhere } from 'src/search/helpers/queryHelper';
import { AdminSerializedUser } from './types/adminSerializedUser';
import { CreateAdminUserDto } from './dto/create-useradmin.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>
    ) { }

    async createUser(createUserDto: CreateUserDto) {

        const userEmail = createUserDto.email;
        const userCPF = createUserDto.cpf;
        //Check if email belongs to deleted account
        if (await this.findDeletedByEmail(userEmail)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este email pertence à uma conta que foi deletada ou suspensa', {})
            );
        }

        //Check if email belongs to deleted account
        if (await this.findDeletedByCpf(userCPF)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este documento pertence à uma conta que foi deletada ou suspensa', {})
            );
        }

        //checking if e-mail already exists
        if (await this.findByEmail(userEmail)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este email já está em uso', {})
            );
        }
        //checking if CPF already exists
        if (await this.findByCPF(userCPF)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este documento já está em uso', {})
            );
        }
        //enconde password
        const password = encodePassword(createUserDto.password);

        const newUser = this.userRepository.create({ ...createUserDto, password });


        try {
            const user = this.userRepository.save(newUser)
            return customMessage(HttpStatus.OK, 'Conta criada com sucesso', {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async adminCreateUser(createAdminUserDto: CreateAdminUserDto) {

        const userEmail = createAdminUserDto.email;
        const userCPF = createAdminUserDto.cpf;
        //Check if email belongs to deleted account
        if (await this.findDeletedByEmail(userEmail)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este email pertence à uma conta que foi deletada ou suspensa', {})
            );
        }

        //Check if email belongs to deleted account
        if (await this.findDeletedByCpf(userCPF)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este documento pertence à uma conta que foi deletada ou suspensa', {})
            );
        }

        //checking if e-mail already exists
        if (await this.findByEmail(userEmail)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este email já está em uso', {})
            );
        }
        //checking if CPF already exists
        if (await this.findByCPF(userCPF)) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este documento já está em uso', {})
            );
        }
        //enconde password
        const password = encodePassword(createAdminUserDto.password);

        const newUser = this.userRepository.create({ ...createAdminUserDto, password });


        try {
            const user = this.userRepository.save(newUser)
            return customMessage(HttpStatus.OK, 'Conta criada com sucesso', {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async findUserById(id: string): Promise<object> {
        const user: Users = await this.getUserById(id);

        try {
            return customMessage(
                HttpStatus.OK,
                `Usuário do ID: ${id}`,
                new SerializedUser(user)
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async adminFindUserById(id: string): Promise<object> {
        var user: Users = new Users()
        try {
            user = await this.userRepository.findOne({
                withDeleted: true,
                where: { id }
            })
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!user) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Usuário especificado não existe.", {})
            )
        }

        try {
            return customMessage(
                HttpStatus.OK,
                `Usuário do ID: ${id}`,
                new AdminSerializedUser(user)
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        await this.getUserById(id);
        try {
            await this.userRepository.update(id, updateUserDto);
            return customMessage(HttpStatus.OK, 'Usuário atualizado com sucesso', {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }
    
    async getUserById(id: string) {
        var user: Users = new Users()
        try {
            user = await this.userRepository.findOneBy({ id })
        } catch (error) {
            InternalServerExcp(error);
        }

        if (!user) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Usuário especificado não existe.", {})
            )
        }

        return user;
    }

    async findDeletedByEmail(email: string) {
        return await this.userRepository.findOne({
            withDeleted: true,
            where: { email, deletedAt: Not(IsNull()) }
        });
    }

    async findDeletedByCpf(cpf: string) {
        return await this.userRepository.findOne({
            withDeleted: true,
            where: { cpf, deletedAt: Not(IsNull()) }
        });
    }

    async findByEmail(email: string) {
        return await this.userRepository.findOneBy({ email });
    }

    async findByCPF(cpf: string) {        
        var user: Users = new Users()
        try {
            user = await this.userRepository.findOneBy({ cpf })
        } catch (error) {
            InternalServerExcp(error);
        }

        return user;
    }
    
    async softDeleteUser(id: string){
        const user = await this.getUserById(id);

        try {
            await this.userRepository.softRemove(user);
            return customMessage(HttpStatus.OK,
                "Usuário deletado com sucesso",
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async restoreUser(id: string){
        const user = await this.userRepository.findOne({
            withDeleted: true,
            where: { id, deletedAt: Not(IsNull()) }
        });

        if(!user){
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Usuário especificado não existe ou não foi deletado.", {})
            )
        }
        
        try {
            await this.userRepository.restore(id);
            return customMessage(HttpStatus.OK,
                "Usuário recuperado com sucesso",
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    public async adminSearchUsers(
        { page, limit, size, offset }: Pagination,
        sort?: Sorting,
        filter?: Filtering,
    ) {
        const where = getWhere(filter);
        const order = getOrder(sort);

        const [languages, total] = await this.userRepository.findAndCount({
            withDeleted:true,
            where,
            order,
            take: limit,
            skip: offset,
        });

        return {
            totalItems: total,
            items: languages.map(language => new SerializedUser(language)),
            page,
            size
        };
    }
}