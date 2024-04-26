import { Wells } from "src/wells/entities/well.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Monitoring {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column()
    flow: number

    @Column()
    level: number

    @Column()
    pumpTime: number

    @Column()
    date: Date

    @ManyToOne(() => Wells,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        @JoinColumn({ name: 'wellId' })
    well: Wells

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