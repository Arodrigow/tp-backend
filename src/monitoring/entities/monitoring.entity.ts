import { Wells } from "src/wells/entities/well.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name:'monitoring'})
export class Monitoring {

    @PrimaryGeneratedColumn('increment')
    id: number

    @Column(
        {
          type: "numeric",
          nullable:true
        })
    flow: number

    @Column(
        {
          type: "numeric",
          nullable:true
        })
    level: number

    @Column(
        {
          type: "numeric",
          nullable:true
        })
    pumpTime: number

    @Column({
        nullable:true
    })
    date: Date

    @Column()
    @Index()
    wellId: string

    @ManyToOne(() => Wells,
        {
            orphanedRowAction: 'delete',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        })
        @JoinColumn({name: 'wellId', referencedColumnName:'id' })
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