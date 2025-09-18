import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAuditableColumns1758162598520 implements MigrationInterface {
  name = 'AddAuditableColumns1758162598520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "nature" character varying, "email" character varying(100) NOT NULL, "password" character varying NOT NULL, "phone" character varying(20), "cpf" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "city" character varying, "state" character varying(2), "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_users_is_active" ON "users" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdUserId" character varying(64), "createdFunctionName" character varying(128) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updatedUserId" character varying(64), "updatedFunctionName" character varying(128), "deletedAt" TIMESTAMP, "deletedUserId" character varying(64), "deletedFunctionName" character varying(128), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "startAt" date NOT NULL, "endAt" date NOT NULL, "purchaseClosedAt" date NOT NULL, "inscriptionPrice" numeric(10,2) NOT NULL, "inscriptionLimit" integer NOT NULL, "status" character varying(50) NOT NULL, "location" json, "description" character varying(1000) NOT NULL, "bannerUrl" character varying(1000), "is_active" boolean NOT NULL DEFAULT true, "organizerId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"), CONSTRAINT "FK_events_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE SET NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_runners_users" ("eventId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_events_runners_users" PRIMARY KEY ("eventId", "userId"), CONSTRAINT "FK_events_runners_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE, CONSTRAINT "FK_events_runners_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_judges_users" ("eventId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_events_judges_users" PRIMARY KEY ("eventId", "userId"), CONSTRAINT "FK_events_judges_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE, CONSTRAINT "FK_events_judges_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_speakers_users" ("eventId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_events_speakers_users" PRIMARY KEY ("eventId", "userId"), CONSTRAINT "FK_events_speakers_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE, CONSTRAINT "FK_events_speakers_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_organizerId" ON "events" ("organizerId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_is_active" ON "events" ("is_active")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_status" ON "events" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_startAt" ON "events" ("startAt")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_endAt" ON "events" ("endAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "events_speakers_users"`);
    await queryRunner.query(`DROP TABLE "events_judges_users"`);
    await queryRunner.query(`DROP TABLE "events_runners_users"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
