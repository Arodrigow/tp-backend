import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import customMessage from 'src/shared/responses/customMessage.response';
import { SerializedUser } from './types/serializedUser';

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
                customMessage(HttpStatus.CONFLICT, 'Este CPF pertence à uma conta que foi deletada ou suspensa', {})
            );
        }

        //checking if e-mail already exists
        if ((await this.findByEmail(userEmail)).length != 0) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este email já está em uso', {})
            );
        }
        //checking if CPF already exists
        if ((await this.findByCPF(userCPF)).length != 0) {
            throw new ConflictException(
                customMessage(HttpStatus.CONFLICT, 'Este CPF já está em uso', {})
            );
        }

        const newUser = this.userRepository.create({ ...createUserDto });


        try {
            const user = this.userRepository.save(newUser)
            return customMessage(HttpStatus.OK, 'Conta criada com sucesso', {})
        } catch (err) {
            throw new InternalServerErrorException(
                customMessage(HttpStatus.INTERNAL_SERVER_ERROR, 'Um erro foi encontrado! Tente mais tarde, por favor', {})
            )
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
        } catch (err) {
            Logger.error('Erro encontrado: ', err)
            throw new InternalServerErrorException(
                customMessage(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Um erro foi encontrado! Tente mais tarde, por favor',
                    {}
                )
            )
        }
    }

    async findAll(): Promise<object> {

        try {
            const users: Array<Users> = await this.userRepository.find();
            return customMessage(
                HttpStatus.OK,
                'Lista de todos os usuários',
                users.map((user) => new SerializedUser(user))
            )
        } catch (error) {
            Logger.error('Erro encontrado: ', error)
            throw new InternalServerErrorException(
                customMessage(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Um erro foi encontrado! Tente mais tarde, por favor',
                    {}
                )
            )
        }
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        await this.getUserById(id);
        try {
            await this.userRepository.update(id, updateUserDto);
            return customMessage(HttpStatus.OK, 'Usuário atualizado com sucesso', {})
        } catch (error) {
            Logger.error('Erro encontrado: ', error)
            throw new InternalServerErrorException(
                customMessage(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Um erro foi encontrado! Tente mais tarde, por favor',
                    {}
                )
            )
        }
    }
    
    async getUserById(id: string) {
        var user: Users = new Users()
        try {
            user = await this.userRepository.findOneBy({ id })
        } catch (error) {
            Logger.error('Erro encontrado: ', error)
            throw new InternalServerErrorException(
                customMessage(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Um erro foi encontrado! Tente mais tarde, por favor',
                    {}
                )
            )
        }

        if (!user) {
            throw new NotFoundException(
                customMessage(HttpStatus.NOT_FOUND, "Usuário específicado não existe.", {})
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
        return await this.userRepository.findBy({ email });
    }

    async findByCPF(cpf: string) {
        return await this.userRepository.findBy({ cpf });
    }
}
