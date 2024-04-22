import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid'

@Entity()
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