import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSameEntities1759029128989 implements MigrationInterface {
  name = 'CreateSameEntities1759029128989';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passwords" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "status" character varying NOT NULL DEFAULT 'available', "eventId" uuid NOT NULL, "categoryId" uuid NOT NULL, "soldAt" TIMESTAMP, CONSTRAINT "PK_c5629066962a085dea3b605e49f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "scores" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "subscriptionId" uuid NOT NULL, "judgeId" uuid NOT NULL, "vote" character varying NOT NULL, "points" integer, "comments" text, "eventId" uuid, CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "eventId" uuid NOT NULL, "categoryId" uuid NOT NULL, "passwordId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "subscribedAt" TIMESTAMP NOT NULL DEFAULT now(), "confirmedAt" TIMESTAMP, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" ADD CONSTRAINT "FK_e490755a57f9df050aa7bd96e16" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" ADD CONSTRAINT "FK_b346ad6e2a9dde6c25c83501356" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" ADD CONSTRAINT "FK_8376c7e54c93c7f150272b7e475" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" ADD CONSTRAINT "FK_54c71ce29bcac1216b298c22556" FOREIGN KEY ("judgeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" ADD CONSTRAINT "FK_1094d63480ec9621dc91dec2df4" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_2dab1a1c63ff25f08fff8149c5d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_c7aed352d98191df66bb2d4f041" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_415693079102a24fc5312163231" FOREIGN KEY ("passwordId") REFERENCES "passwords"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_415693079102a24fc5312163231"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_c7aed352d98191df66bb2d4f041"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_2dab1a1c63ff25f08fff8149c5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_fbdba4e2ac694cf8c9cecf4dc84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" DROP CONSTRAINT "FK_1094d63480ec9621dc91dec2df4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" DROP CONSTRAINT "FK_54c71ce29bcac1216b298c22556"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" DROP CONSTRAINT "FK_8376c7e54c93c7f150272b7e475"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" DROP CONSTRAINT "FK_b346ad6e2a9dde6c25c83501356"`,
    );
    await queryRunner.query(
      `ALTER TABLE "passwords" DROP CONSTRAINT "FK_e490755a57f9df050aa7bd96e16"`,
    );
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "scores"`);
    await queryRunner.query(`DROP TABLE "passwords"`);
  }
}
