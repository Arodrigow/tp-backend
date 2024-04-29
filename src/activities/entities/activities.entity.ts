import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Activities {

    @Column()
    processo: string;

    @Column()
    munSolic: string;

    @Column()
    codAtivPrim: string;

    @Column()
    riscoAr: string;

    @Column()
    riscoAgua: string;

    @Column()
    riscoSolo: string;

    @Column()
    riscoTotal: string;

    @Column()
    list: string;

    @Column()
    descAtivPrim: string;

    @Column()
    classe: number;

    @Column()
    fatLocRes: number;

    @Column()
    modLic: string;

    @Column()
    faseLic: string;

    @Column()
    undAnalis: string;

    @Column(
        {
            type: "numeric",
        }
    )
    lat: number;

    @Column(
        {
            type: "numeric",
        }
    )
    long: number;

    @Column()
    dataSla: number;

    @Column()
    vigLicAng: number;

    @PrimaryGeneratedColumn('uuid')
    id: string = uuidv4();

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