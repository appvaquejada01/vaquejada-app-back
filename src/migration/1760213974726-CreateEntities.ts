import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEntities1760213974726 implements MigrationInterface {
    name = 'CreateEntities1760213974726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scores" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscriptionId" uuid NOT NULL, "judgeId" uuid NOT NULL, "vote" character varying NOT NULL, "points" integer, "comments" text, "eventId" uuid, CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "passwords" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'available', "eventId" uuid NOT NULL, "categoryId" uuid NOT NULL, "subscriptionId" uuid, "soldAt" TIMESTAMP, CONSTRAINT "PK_c5629066962a085dea3b605e49f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "eventId" uuid NOT NULL, "categoryId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(), "confirmedAt" TIMESTAMP, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" character varying(1000) NOT NULL, "rules" character varying(1000), "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_categories" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "price" numeric(10,2) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "maxRunners" integer NOT NULL, "currentRunners" integer NOT NULL DEFAULT '0', "passwordLimit" integer NOT NULL DEFAULT '0', "isActive" boolean NOT NULL DEFAULT true, "eventId" uuid, "categoryId" uuid, CONSTRAINT "PK_a6368447a61afbf9def09fd81af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "startAt" TIMESTAMP WITH TIME ZONE NOT NULL, "endAt" TIMESTAMP WITH TIME ZONE NOT NULL, "purchaseClosedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(50) NOT NULL, "address" character varying(500), "city" character varying(100), "prize" character varying(500), "state" character varying(2), "description" character varying(1000) NOT NULL, "bannerUrl" character varying(1000), "is_active" boolean NOT NULL DEFAULT true, "isPublic" boolean NOT NULL DEFAULT false, "bannerPublicId" character varying, "organizerId" uuid NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "nature" character varying, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "phone" character varying(20), "cpf" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "city" character varying, "state" character varying(2), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_runners" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_df1c228058f43cd87c0e16c73c4" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_40c9028dc9d1984634ae0d2527" ON "event_runners" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_90d3abf2da2855fb2cc93030d6" ON "event_runners" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "event_judges" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_71f941d8a738c52f268b185686a" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8190fdb5be181f352a901c1bb1" ON "event_judges" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_955739d40b140fc07554589c5a" ON "event_judges" ("user_id") `);
        await queryRunner.query(`CREATE TABLE "event_speakers" ("event_id" uuid NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_c4fb1e9170943985b9bc4f64795" PRIMARY KEY ("event_id", "user_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_600c2c351361372ee94e1a3bdc" ON "event_speakers" ("event_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d97de915946f1dd5973af5702f" ON "event_speakers" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_8376c7e54c93c7f150272b7e475" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_54c71ce29bcac1216b298c22556" FOREIGN KEY ("judgeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scores" ADD CONSTRAINT "FK_1094d63480ec9621dc91dec2df4" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passwords" ADD CONSTRAINT "FK_e490755a57f9df050aa7bd96e16" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passwords" ADD CONSTRAINT "FK_b346ad6e2a9dde6c25c83501356" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "passwords" ADD CONSTRAINT "FK_d111b7cae1da28781b7fe1675d1" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_2dab1a1c63ff25f08fff8149c5d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_c7aed352d98191df66bb2d4f041" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories" ADD CONSTRAINT "FK_fe3e9759d80ef9c9c454f1ee682" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_categories" ADD CONSTRAINT "FK_51417a371e495187e156a7f63b8" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_1024d476207981d1c72232cf3ca" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_runners" ADD CONSTRAINT "FK_40c9028dc9d1984634ae0d25273" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_runners" ADD CONSTRAINT "FK_90d3abf2da2855fb2cc93030d63" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_judges" ADD CONSTRAINT "FK_8190fdb5be181f352a901c1bb1b" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_judges" ADD CONSTRAINT "FK_955739d40b140fc07554589c5a5" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_speakers" ADD CONSTRAINT "FK_600c2c351361372ee94e1a3bdc1" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_speakers" ADD CONSTRAINT "FK_d97de915946f1dd5973af5702f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_speakers" DROP CONSTRAINT "FK_d97de915946f1dd5973af5702f4"`);
        await queryRunner.query(`ALTER TABLE "event_speakers" DROP CONSTRAINT "FK_600c2c351361372ee94e1a3bdc1"`);
        await queryRunner.query(`ALTER TABLE "event_judges" DROP CONSTRAINT "FK_955739d40b140fc07554589c5a5"`);
        await queryRunner.query(`ALTER TABLE "event_judges" DROP CONSTRAINT "FK_8190fdb5be181f352a901c1bb1b"`);
        await queryRunner.query(`ALTER TABLE "event_runners" DROP CONSTRAINT "FK_90d3abf2da2855fb2cc93030d63"`);
        await queryRunner.query(`ALTER TABLE "event_runners" DROP CONSTRAINT "FK_40c9028dc9d1984634ae0d25273"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_1024d476207981d1c72232cf3ca"`);
        await queryRunner.query(`ALTER TABLE "event_categories" DROP CONSTRAINT "FK_51417a371e495187e156a7f63b8"`);
        await queryRunner.query(`ALTER TABLE "event_categories" DROP CONSTRAINT "FK_fe3e9759d80ef9c9c454f1ee682"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_c7aed352d98191df66bb2d4f041"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_2dab1a1c63ff25f08fff8149c5d"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`);
        await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "FK_d111b7cae1da28781b7fe1675d1"`);
        await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "FK_b346ad6e2a9dde6c25c83501356"`);
        await queryRunner.query(`ALTER TABLE "passwords" DROP CONSTRAINT "FK_e490755a57f9df050aa7bd96e16"`);
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_1094d63480ec9621dc91dec2df4"`);
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_54c71ce29bcac1216b298c22556"`);
        await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_8376c7e54c93c7f150272b7e475"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d97de915946f1dd5973af5702f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_600c2c351361372ee94e1a3bdc"`);
        await queryRunner.query(`DROP TABLE "event_speakers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_955739d40b140fc07554589c5a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8190fdb5be181f352a901c1bb1"`);
        await queryRunner.query(`DROP TABLE "event_judges"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_90d3abf2da2855fb2cc93030d6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40c9028dc9d1984634ae0d2527"`);
        await queryRunner.query(`DROP TABLE "event_runners"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "event_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "passwords"`);
        await queryRunner.query(`DROP TABLE "scores"`);
    }

}
