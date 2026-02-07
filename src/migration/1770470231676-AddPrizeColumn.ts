import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPrizeColumn1770470231676 implements MigrationInterface {
  name = 'AddPrizeColumn1770470231676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" ADD "prize" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" DROP COLUMN "prize"`,
    );
  }
}
