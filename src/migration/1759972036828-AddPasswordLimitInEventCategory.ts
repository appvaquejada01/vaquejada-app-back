import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordLimitInEventCategory1759972036828
  implements MigrationInterface
{
  name = 'AddPasswordLimitInEventCategory1759972036828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" ADD "passwordLimit" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" DROP COLUMN "passwordLimit"`,
    );
  }
}
