import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Activities1714348407186 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'activities',
            columns: [
                {
                    name:'processo',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'munSolic',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'codAtivPrim',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'riscoAr',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'riscoAgua',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'riscoSolo',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'riscoTotal',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'list',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'descAtivPrim',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'classe',
                    type:'INT',
                    isNullable: true
                },
                {
                    name:'fatLocRes',
                    type:'INT',
                    isNullable: true
                },
                {
                    name:'modLic',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'faseLic',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'undAnalis',
                    type:'TEXT',
                    isNullable: true
                },
                {
                    name:'lat',
                    type:'NUMERIC(10, 8)',
                    isNullable: true
                },
                {
                    name:'long',
                    type:'NUMERIC(10, 8)',
                    isNullable: true
                },
                {
                    name:'dataSla',
                    type:'INT',
                    isNullable: true
                },
                {
                    name:'vigLicAng',
                    type:'INT',
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
        await queryRunner.dropTable('activities')
    }

}
