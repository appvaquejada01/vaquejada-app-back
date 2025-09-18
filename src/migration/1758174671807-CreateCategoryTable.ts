import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryTable1758174671807 implements MigrationInterface {
    name = 'CreateCategoryTable1758174671807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "inscriptionPrice" numeric(10,2) NOT NULL, "observation" character varying(1000) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "passQuantity" integer NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events_categories_categories" ("eventsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_cbafb88d0a713682a8354e21124" PRIMARY KEY ("eventsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ec1afd5bf48b617b478e86ea6" ON "events_categories_categories" ("eventsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_91500cdda8bef78e27a5fc795f" ON "events_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "startAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "startAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "endAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "endAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "purchaseClosedAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "purchaseClosedAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" ADD CONSTRAINT "FK_8ec1afd5bf48b617b478e86ea60" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" ADD CONSTRAINT "FK_91500cdda8bef78e27a5fc795f8" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events_categories_categories" DROP CONSTRAINT "FK_91500cdda8bef78e27a5fc795f8"`);
        await queryRunner.query(`ALTER TABLE "events_categories_categories" DROP CONSTRAINT "FK_8ec1afd5bf48b617b478e86ea60"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "purchaseClosedAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "purchaseClosedAt" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "endAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "endAt" date NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "startAt"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "startAt" date NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91500cdda8bef78e27a5fc795f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ec1afd5bf48b617b478e86ea6"`);
        await queryRunner.query(`DROP TABLE "events_categories_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
