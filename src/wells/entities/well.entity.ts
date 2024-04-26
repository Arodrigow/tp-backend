import { Monitoring } from "src/monitoring/entities/monitoring.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Wells {

  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  userId: string;

  @Column()
  ordinance: string;

  @Column({ default: false })
  hasActiveUser: boolean;

  @OneToMany(() => Monitoring, (monitoring) => monitoring.well,
    {
      cascade: true, eager: true
    })
  monitoring: Monitoring;

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