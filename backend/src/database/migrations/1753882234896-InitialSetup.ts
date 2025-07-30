import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1753882234896 implements MigrationInterface {
    name = 'InitialSetup1753882234896'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "filmes" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "filmes" DROP COLUMN "notaUsuario"`);
        await queryRunner.query(`ALTER TABLE "filmes" ADD "notaUsuario" numeric`);
        await queryRunner.query(`ALTER TABLE "filmes" ADD CONSTRAINT "FK_ebf7f62a38c7121de24c545de67" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "filmes" DROP CONSTRAINT "FK_ebf7f62a38c7121de24c545de67"`);
        await queryRunner.query(`ALTER TABLE "filmes" DROP COLUMN "notaUsuario"`);
        await queryRunner.query(`ALTER TABLE "filmes" ADD "notaUsuario" real NOT NULL`);
        await queryRunner.query(`ALTER TABLE "filmes" DROP COLUMN "user_id"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
