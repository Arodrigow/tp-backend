import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Wells1713965202038 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'wells',
            columns: [
                {
                    name:'supram',
                    type:'TEXT',
                    isNullable:true
                },
                {
                    name:'muni',
                    type:'TEXT',
                    isNullable:true
                },
                {
                    name:'ordinance',
                    type:'BIGINT',
                    isNullable: false
                },
                {
                    name:'LON',
                    type:'NUMERIC(10, 8)',
                    isNullable: true
                },
                {
                    name:'LAT',
                    type:'NUMERIC(10, 8)',
                    isNullable: true
                },
                {
                    name:'NE',
                    type:'NUMERIC(5, 2)',
                    isNullable: true
                },
                {
                    name:'ND',
                    type:'NUMERIC(5, 2)',
                    isNullable: true
                },
                {
                    name:'vaz',
                    type:'NUMERIC(5, 2)',
                    isNullable: true
                },
                {
                    name:'tCap',
                    type:'INT',
                    isNullable: true
                },
                {
                    name:'profPc',
                    type:'NUMERIC(6, 2)',
                    isNullable: true
                },
                {
                    name:'diaPcmm',
                    type:'NUMERIC(6, 2)',
                    isNullable: true
                },
                {
                    name:'modUso',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'finUso',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'tipoReg',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'dataVenc',
                    type:'TIMESTAMP',
                    isNullable: true
                },
                {
                    name:'dataInic',
                    type:'TIMESTAMP',
                    isNullable: true
                },
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'userId',
                    type: 'uuid',
                    isNullable: true
                },
                {
                    name: 'hasActiveUser',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'situ',
                    type: 'TEXT',
                    default: "'ATIVO'",
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP(6)',
                    onUpdate: 'CURRENT_TIMESTAMP(6)'
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp',
                    isNullable: true
                },
            ]
        }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('wells')
    }

}
