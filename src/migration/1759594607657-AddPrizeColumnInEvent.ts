import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrizeColumnInEvent1759594607657 implements MigrationInterface {
  name = 'AddPrizeColumnInEvent1759594607657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD "prize" character varying(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "prize"`);
  }
}
