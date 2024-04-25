import { Users } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid'

@Entity()
export class Wells {

    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

    @Column()
    userId: string;

    @Column()
    ordinance: string;

    @Column({default:false})
    hasActiveUser: boolean

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