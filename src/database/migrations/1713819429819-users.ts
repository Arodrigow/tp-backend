import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Users1713819429819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    default: 'uuid_generate_v4()',
                    isGenerated: true,
                    generationStrategy: 'uuid',
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'cpf',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',

                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'phone_number',
                    type: 'varchar'
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default:'CURRENT_TIMESTAMP(6)'
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default:'CURRENT_TIMESTAMP(6)',
                    onUpdate: 'CURRENT_TIMESTAMP(6)'
                },
                {
                    name: 'deletedAt',
                    type: 'timestamp',
                    isNullable: true
                },
            ],
        }),
        true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
