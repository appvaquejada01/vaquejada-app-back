import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdjustAddressColumns1758171139790 implements MigrationInterface {
  name = 'AdjustAddressColumns1758171139790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_events_organizer"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "FK_events_runners_event"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "FK_events_runners_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "FK_events_judges_event"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "FK_events_judges_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "FK_events_speakers_event"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "FK_events_speakers_user"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_events_organizerId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_events_is_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_events_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_events_startAt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_events_endAt"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_users_is_active"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "location"`);
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_events_runners_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_events_runners_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP COLUMN "eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_events_runners_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_events_judges_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_events_judges_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP COLUMN "eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_events_judges_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_events_speakers_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_events_speakers_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP COLUMN "eventId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_events_speakers_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "address" character varying(500)`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "city" character varying(100)`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD "state" character varying(2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD "eventsId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_de97734b854cce9f6178e7ad467" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD "usersId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_de97734b854cce9f6178e7ad467"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_be53fa4823a5203be03a8b9138e" PRIMARY KEY ("eventsId", "usersId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD "eventsId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_b763d31ab5cf181ebe43f7ba430" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD "usersId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_b763d31ab5cf181ebe43f7ba430"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_4412a7c7228c873e5d36345e104" PRIMARY KEY ("eventsId", "usersId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD "eventsId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_82ee0582da4c7c1d6ecded60752" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD "usersId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_82ee0582da4c7c1d6ecded60752"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_3215c8730a22cb2fc7d83089df5" PRIMARY KEY ("eventsId", "usersId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_de97734b854cce9f6178e7ad46" ON "events_runners_users" ("eventsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2d4a79a7e5a63020462e96d830" ON "events_runners_users" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b763d31ab5cf181ebe43f7ba43" ON "events_judges_users" ("eventsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_54465a3ec8ea2029f4e2db8ad7" ON "events_judges_users" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82ee0582da4c7c1d6ecded6075" ON "events_speakers_users" ("eventsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eb1259cce9ca45aee5f7603891" ON "events_speakers_users" ("usersId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_1024d476207981d1c72232cf3ca" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "FK_de97734b854cce9f6178e7ad467" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "FK_2d4a79a7e5a63020462e96d830a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "FK_b763d31ab5cf181ebe43f7ba430" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "FK_54465a3ec8ea2029f4e2db8ad7e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "FK_82ee0582da4c7c1d6ecded60752" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "FK_eb1259cce9ca45aee5f76038911" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "FK_eb1259cce9ca45aee5f76038911"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "FK_82ee0582da4c7c1d6ecded60752"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "FK_54465a3ec8ea2029f4e2db8ad7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "FK_b763d31ab5cf181ebe43f7ba430"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "FK_2d4a79a7e5a63020462e96d830a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "FK_de97734b854cce9f6178e7ad467"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_1024d476207981d1c72232cf3ca"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eb1259cce9ca45aee5f7603891"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_82ee0582da4c7c1d6ecded6075"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_54465a3ec8ea2029f4e2db8ad7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b763d31ab5cf181ebe43f7ba43"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2d4a79a7e5a63020462e96d830"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_de97734b854cce9f6178e7ad46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_3215c8730a22cb2fc7d83089df5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_82ee0582da4c7c1d6ecded60752" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP COLUMN "usersId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_82ee0582da4c7c1d6ecded60752"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP COLUMN "eventsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_4412a7c7228c873e5d36345e104"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_b763d31ab5cf181ebe43f7ba430" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP COLUMN "usersId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_b763d31ab5cf181ebe43f7ba430"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP COLUMN "eventsId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_be53fa4823a5203be03a8b9138e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_de97734b854cce9f6178e7ad467" PRIMARY KEY ("eventsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP COLUMN "usersId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_de97734b854cce9f6178e7ad467"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP COLUMN "eventsId"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "address"`);
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_events_speakers_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD "eventId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" DROP CONSTRAINT "PK_events_speakers_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "PK_events_speakers_users" PRIMARY KEY ("eventId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_events_judges_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD "eventId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" DROP CONSTRAINT "PK_events_judges_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "PK_events_judges_users" PRIMARY KEY ("eventId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_events_runners_users" PRIMARY KEY ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD "eventId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" DROP CONSTRAINT "PK_events_runners_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "PK_events_runners_users" PRIMARY KEY ("eventId", "userId")`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "location" json`);
    await queryRunner.query(
      `CREATE INDEX "IDX_users_is_active" ON "users" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_endAt" ON "events" ("endAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_startAt" ON "events" ("startAt") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_status" ON "events" ("status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_is_active" ON "events" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_events_organizerId" ON "events" ("organizerId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "FK_events_speakers_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_speakers_users" ADD CONSTRAINT "FK_events_speakers_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "FK_events_judges_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_judges_users" ADD CONSTRAINT "FK_events_judges_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "FK_events_runners_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_runners_users" ADD CONSTRAINT "FK_events_runners_event" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_events_organizer" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
