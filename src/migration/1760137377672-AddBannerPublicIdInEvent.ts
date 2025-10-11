import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBannerPublicIdInEvent1760137377672
  implements MigrationInterface
{
  name = 'AddBannerPublicIdInEvent1760137377672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" ADD "bannerPublicId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN "bannerPublicId"`,
    );
  }
}
