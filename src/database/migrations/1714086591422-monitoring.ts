import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Monitoring1714086591422 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'monitoring',
            columns: [
                {
                    name: 'id',
                    type: 'smallint',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'wellId',
                    type: 'uuid',
                    isNullable: false
                },
                {
                    name: 'flow',
                    type: 'NUMERIC(7,3)',
                    isNullable: true
                },
                {
                    name: 'level',
                    type: 'NUMERIC(7,3)',
                    isNullable: true
                },
                {
                    name: 'pumpTime',
                    type: 'NUMERIC(7,3)',
                    isNullable: true
                },
                {
                    name: 'date',
                    type: 'timestamp',
                    isNullable: true
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
                }
            ]
        }),
            true
        );

        const foreignKey = new TableForeignKey({
            columnNames: ['wellId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'wells',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',

        });
        
        await queryRunner.createForeignKey('monitoring', foreignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('monitoring');
    }

}
