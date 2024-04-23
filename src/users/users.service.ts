import { ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Users } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import customMessage from 'src/shared/responses/customMessage.response';

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
            if (user) {
                return customMessage(HttpStatus.OK, 'Conta criada com sucesso', {})
            }
        } catch (err) {
            throw new InternalServerErrorException(
                customMessage(HttpStatus.INTERNAL_SERVER_ERROR, 'Um erro foi encontrado! Tente mais tarde, por favor', {})
            )
        }
    }

    async findUserById(id: string): Promise<Users> {
        const user = await this.userRepository.findOneBy({ id });
        return user;
    }

    async findAll(): Promise<Array<Users>> {
        const result = await this.userRepository.find();
        return result;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        const userUpdated = await this.userRepository.update(id, updateUserDto);
        return userUpdated;
    }

    async softDeleteUser(id: string) {
        const result = await this.userRepository.softDelete(id);
        return result;
    }

    async restoreUser(id: string) {
        const result = await this.userRepository.restore(id);
        return result
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
