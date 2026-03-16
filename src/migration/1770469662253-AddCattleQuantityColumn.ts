import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCattleQuantityColumn1770469662253
  implements MigrationInterface
{
  name = 'AddCattleQuantityColumn1770469662253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" ADD "cattleQuantity" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_categories" DROP COLUMN "cattleQuantity"`,
    );
  }
}
