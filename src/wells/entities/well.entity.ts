import { Monitoring } from "src/monitoring/entities/monitoring.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'

@Entity({ name: 'wells' })
export class Wells {

  @Column(
    {
      nullable: true
    }
  )
  supram: string;

  @Column(
    {
      nullable: true
    }
  )
  muni: string;

  @Column(
    {
      type: "numeric",
      nullable: true
    }
  )
  LON: number;

  @Column(
    {
      type: "numeric",
      nullable: true
    })
  LAT: number;

  @Column({
    nullable: true
  })
  ordinance: number;

  @Column(
    {
      type: "numeric",
      nullable: true
    })
  NE: number;

  @Column(
    {
      type: "numeric",
      nullable: true
    })
  ND: number;

  @Column(
    {
      type: "numeric",
      nullable: true
    })
  vaz: number;

  @Column(
    {
      type: "numeric",
      nullable: true
    })
  tCap: number;

  @Column({
    type: "numeric",
    nullable: true
  })
  profPc: number;

  @Column({
    type: "numeric",
    nullable: true
  })
  diaPcmm: number;

  @Column({
    nullable: true
  })
  modUso: string;

  @Column({
    nullable: true
  })
  finUso: string;

  @Column({
    nullable: true
  })
  tipoReg: string;  

  @Column({
    nullable: true
  })
  situ: string;  

  @Column({
    nullable: true
  })
  dataVenc: Date;  

  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column({
    nullable: true
  })
  userId: string;

  @Column({ default: false })
  hasActiveUser: boolean;

  @OneToMany(() => Monitoring, (monitoring) => monitoring.well,
    {
      cascade: ["soft-remove", "update", "recover"],
      eager: true
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