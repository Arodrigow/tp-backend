import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DbTest1714348407186 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'DbTeste',
            columns: [
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
                    name:'numPort',
                    type:'BIGINT',
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
                    name:'statuspa',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'tipoUso',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'modUso',
                    type:'TEXT',
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
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'diaPcmm',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'finUso',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'tpoConsu',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'siglaCh',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'baciaFede',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'ueg',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'chNome',
                    type:'TEXT',
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
                    isNullable: true,
                    default: null
                },
                {
                    name: 'hasActiveUser',
                    type: 'boolean',
                    default: false
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
        await queryRunner.dropTable('DbTeste')
    }

}
