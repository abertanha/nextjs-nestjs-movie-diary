import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserVerificationFields1754327513969 implements MigrationInterface {
    name = 'AddUserVerificationFields1754327513969'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isEmailVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "emailVerificationToken" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_0e5c4e20d6347103f882d8312a" ON "user" ("emailVerificationToken") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_0e5c4e20d6347103f882d8312a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailVerificationToken"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isEmailVerified"`);
    }

}
