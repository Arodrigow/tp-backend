import { ConflictException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
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
import { WellsService } from 'src/wells/wells.service';
import objectToArray from 'src/shared/utils/objectToArray';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users) private readonly userRepository: Repository<Users>,
        @Inject(forwardRef(() => WellsService))
        private readonly wellService: WellsService
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
    
    async adminFindCategories() {
        
        const id: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`id`).distinct(true).getRawMany();
        const name: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`name`).distinct(true).getRawMany();
        const cpf: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`cpf`).distinct(true).getRawMany();
        const email: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`email`).distinct(true).getRawMany();
        const phone_number: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`phone_number`).distinct(true).getRawMany();
        const role: Array<Object> = await this.userRepository.createQueryBuilder('users').select(`role`).distinct(true).getRawMany();
    
        return customMessage(
            HttpStatus.OK,
            `Admin search users lists`,
            {
                id:objectToArray(id),
                name: objectToArray(name),
                cpf: objectToArray(cpf),
                email: objectToArray(email),
                phone_number: objectToArray(phone_number),
                role: objectToArray(role)
            }
        )
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        await this.getUserById(id);
        try {
            if (updateUserDto.password) {
                await this.userRepository.update(id,
                    {
                        password: encodePassword(updateUserDto.password),
                        name: updateUserDto.name,
                        email: updateUserDto.email,
                        phone_number: updateUserDto.phone_number
                    });
                return customMessage(HttpStatus.OK, 'Usuário atualizado com sucesso', {})
            }
            
            await this.userRepository.update(id, updateUserDto);

            return customMessage(HttpStatus.OK, 'Usuário atualizado com sucesso', {})
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async adminResetPassword(id: string) {
        const user = await this.getUserById(id);
        const newPassword = encodePassword(user.cpf);
        try {
            await this.userRepository.update(id, { password: newPassword });
            return customMessage(HttpStatus.OK, 'Senha de usuário atualizada com sucesso atualizado com sucesso', {})
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

    async softDeleteUser(id: string) {
        const user = await this.getUserById(id);

        try {
            await this.userRepository.softRemove(user);
            await this.wellService.updateOwnershipDeletedUser(user.id);
            return customMessage(HttpStatus.OK,
                "Usuário deletado com sucesso",
                {}
            )
        } catch (error) {
            InternalServerExcp(error);
        }
    }

    async restoreUser(id: string) {
        const user = await this.userRepository.findOne({
            withDeleted: true,
            where: { id, deletedAt: Not(IsNull()) }
        });

        if (!user) {
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
            withDeleted: true,
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