import { Monitoring } from "src/monitoring/entities/monitoring.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Wells {

  @Column(
    {
      type: "numeric",
    }
  )
  LON: number;

  @Column(
    {
      type: "numeric"
    })
  LAT: number;

  @Column()
  ordinance: number;

  @Column(
    {
      type: "numeric"
    })
  NE: number;

  @Column(
    {
      type: "numeric",
    })
  ND: number;

  @Column()
  statuspa: string;

  @Column()
  tipoUso: string;

  @Column()
  modUso: string;

  @Column(
    {
      type: "numeric",
    })
  vaz: number;

  @Column(
    {
      type: "numeric",
    })
  tCap: number;

  @Column()
  profPc: string;

  @Column()
  diaPcmm: string;

  @Column()
  finUso: string;

  @Column()
  tpoConsu: string;

  @Column()
  siglaCh: string;

  @Column()
  baciaFede: string;

  @Column()
  ueg: string;

  @Column()
  chNome: string;

  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  userId: string;

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