import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({name:'shapes'})
export class ShapesData {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'jsonb' })
    geojson: object;
}