import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAllNewEntities1758510579277 implements MigrationInterface {
  name = 'CreateAllNewEntities1758510579277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "createdUserId" character varying(64),
        "createdFunctionName" character varying(128) NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
        "updatedUserId" character varying(64),
        "updatedFunctionName" character varying(128),
        "deletedAt" TIMESTAMP,
        "deletedUserId" character varying(64),
        "deletedFunctionName" character varying(128),
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(200) NOT NULL,
        "email" character varying(200) NOT NULL,
        "cpf" character varying(14),
        "phone" character varying(20),
        "password" character varying(200) NOT NULL,
        "role" character varying(50) NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "maxRunners" integer NOT NULL, "currentRunners" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "eventId" uuid, "categoryId" uuid, CONSTRAINT "PK_a6368447a61afbf9def09fd81af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" character varying(1000) NOT NULL, "rules" character varying(1000), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "purchaseClosedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(50) NOT NULL, "address" character varying(500), "city" character varying(100), "state" character varying(2), "description" character varying(1000) NOT NULL, "bannerUrl" character varying(1000), "is_active" boolean NOT NULL DEFAULT true, "isPublic" boolean NOT NULL DEFAULT false, "organizerId" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_runners" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_df1c228058f43cd87c0e16c73c4" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_40c9028dc9d1984634ae0d2527" ON "event_runners" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_90d3abf2da2855fb2cc93030d6" ON "event_runners" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "event_judges" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_71f941d8a738c52f268b185686a" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8190fdb5be181f352a901c1bb1" ON "event_judges" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_955739d40b140fc07554589c5a" ON "event_judges" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "event_speakers" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_c4fb1e9170943985b9bc4f64795" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_600c2c351361372ee94e1a3bdc" ON "event_speakers" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d97de915946f1dd5973af5702f" ON "event_speakers" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "event_categories" ADD CONSTRAINT "FK_fe3e9759d80ef9c9c454f1ee682" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_categories" ADD CONSTRAINT "FK_51417a371e495187e156a7f63b8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_1024d476207981d1c72232cf3ca" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_runners" ADD CONSTRAINT "FK_40c9028dc9d1984634ae0d25273" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_runners" ADD CONSTRAINT "FK_90d3abf2da2855fb2cc93030d63" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_judges" ADD CONSTRAINT "FK_8190fdb5be181f352a901c1bb1b" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_judges" ADD CONSTRAINT "FK_955739d40b140fc07554589c5a5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_speakers" ADD CONSTRAINT "FK_600c2c351361372ee94e1a3bdc1" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_speakers" ADD CONSTRAINT "FK_d97de915946f1dd5973af5702f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_speakers" DROP CONSTRAINT "FK_d97de915946f1dd5973af5702f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_speakers" DROP CONSTRAINT "FK_600c2c351361372ee94e1a3bdc1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_judges" DROP CONSTRAINT "FK_955739d40b140fc07554589c5a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_judges" DROP CONSTRAINT "FK_8190fdb5be181f352a901c1bb1b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_runners" DROP CONSTRAINT "FK_90d3abf2da2855fb2cc93030d63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_runners" DROP CONSTRAINT "FK_40c9028dc9d1984634ae0d25273"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_1024d476207981d1c72232cf3ca"`,
    );

    await queryRunner.query(
      `ALTER TABLE "event_categories" DROP CONSTRAINT "FK_51417a371e495187e156a7f63b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_categories" DROP CONSTRAINT "FK_fe3e9759d80ef9c9c454f1ee682"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d97de915946f1dd5973af5702f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_600c2c351361372ee94e1a3bdc"`,
    );
    await queryRunner.query(`DROP TABLE "event_speakers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_955739d40b140fc07554589c5a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8190fdb5be181f352a901c1bb1"`,
    );
    await queryRunner.query(`DROP TABLE "event_judges"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_90d3abf2da2855fb2cc93030d6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_40c9028dc9d1984634ae0d2527"`,
    );
    await queryRunner.query(`DROP TABLE "event_runners"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "event_categories"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
