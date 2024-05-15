import { Role } from "src/auth/enums/roles.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid'

@Entity({name:'users'})
export class Users{

    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    name:string

    @Column({unique:true})
    cpf: string;

    @Column()
    password:string;

    @Column({unique:true})
    email:string;

    @Column()
    phone_number:string;
    
    @Column(
      {default:Role.USER}
    )
    role:Role;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
      })
      createdAt!: Date;
    
      @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
      })
      updatedAt!: Date;
    
      @DeleteDateColumn({ name: 'deletedAt', nullable: true })
      deletedAt: Date;
}