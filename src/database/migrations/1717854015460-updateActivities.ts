import { Activities } from "src/activities/entities/activities.entity";
import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateActivities1717854015460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'Médio' WHERE "riscoAr" = 'M'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'Pequeno' WHERE "riscoAr" = 'P'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'Grande' WHERE "riscoAr" = 'G'`)

         await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'Médio' WHERE "riscoAgua" = 'M'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'Pequeno' WHERE "riscoAgua" = 'P'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'Grande' WHERE "riscoAgua" = 'G'`)
         
         await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'Médio' WHERE "riscoSolo" = 'M'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'Pequeno' WHERE "riscoSolo" = 'P'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'Grande' WHERE "riscoSolo" = 'G'`)

         await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'Médio' WHERE "riscoTotal" = 'M'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'Pequeno' WHERE "riscoTotal" = 'P'`)
         await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'Grande' WHERE "riscoTotal" = 'G'`)
         
         
         await queryRunner.query(`UPDATE "activities" SET "processo" = 'Não consta' WHERE "processo" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "munSolic" = 'Não consta' WHERE "munSolic" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "codAtivPrim" = 'Não consta' WHERE "codAtivPrim" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'Não consta' WHERE "riscoAr" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'Não consta' WHERE "riscoAgua" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'Não consta' WHERE "riscoSolo" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'Não consta' WHERE "riscoTotal" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "list" = 'Não consta' WHERE "list" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "descAtivPrim" = 'Não consta' WHERE "descAtivPrim" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "modLic" = 'Não consta' WHERE "modLic" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "faseLic" = 'Não consta' WHERE "faseLic" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "undAnalis" = 'Não consta' WHERE "undAnalis" IS NULL`)
         await queryRunner.query(`UPDATE "activities" SET "muni" = 'Não consta' WHERE "muni" IS NULL`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'G' WHERE "riscoTotal" = 'Grande'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'P' WHERE "riscoTotal" = 'Pequeno'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoTotal" = 'M' WHERE "riscoTotal" = 'Médio'`)

        await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'G' WHERE "riscoSolo" = 'Grande'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'P' WHERE "riscoSolo" = 'Pequeno'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoSolo" = 'M' WHERE "riscoSolo" = 'Médio'`)

        await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'G' WHERE "riscoAgua" = 'Grande'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'P' WHERE "riscoAgua" = 'Pequeno'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoAgua" = 'M' WHERE "riscoAgua" = 'Médio'`)

        await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'G' WHERE "riscoAr" = 'Grande'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'P' WHERE "riscoAr" = 'Pequeno'`)
        await queryRunner.query(`UPDATE "activities" SET "riscoAr" = 'M' WHERE "riscoAr" = 'Médio'`)
        }
}
