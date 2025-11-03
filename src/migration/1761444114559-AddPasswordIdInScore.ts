import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordIdInScore1761444114559 implements MigrationInterface {
  name = 'AddPasswordIdInScore1761444114559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scores" ADD "passwordId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "scores" DROP COLUMN "passwordId"`);
  }
}
