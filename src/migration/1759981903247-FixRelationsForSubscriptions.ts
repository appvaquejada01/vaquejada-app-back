import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRelationsForSubscriptions1759981903247
  implements MigrationInterface
{
  name = 'FixRelationsForSubscriptions1759981903247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passwords" ADD COLUMN "subscriptionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" ADD CONSTRAINT "FK_d111b7cae1da28781b7fe1675d1" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passwords" DROP CONSTRAINT "FK_d111b7cae1da28781b7fe1675d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" DROP COLUMN "subscriptionId"`,
    );
  }
}
