import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventEntity1757801463947 implements MigrationInterface {
  name = 'CreateEventEntity1757801463947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`events\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`startAt\` date NOT NULL, \`endAt\` date NOT NULL, \`purchaseClosedAt\` date NOT NULL, \`inscriptionPrice\` decimal(10,2) NOT NULL, \`inscriptionLimit\` int NOT NULL, \`status\` varchar(50) NOT NULL, \`location\` json NULL, \`description\` varchar(1000) NOT NULL, \`bannerUrl\` varchar(1000) NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`organizerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`events_runners_users\` (\`eventsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_de97734b854cce9f6178e7ad46\` (\`eventsId\`), INDEX \`IDX_2d4a79a7e5a63020462e96d830\` (\`usersId\`), PRIMARY KEY (\`eventsId\`, \`usersId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`events_judges_users\` (\`eventsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_b763d31ab5cf181ebe43f7ba43\` (\`eventsId\`), INDEX \`IDX_54465a3ec8ea2029f4e2db8ad7\` (\`usersId\`), PRIMARY KEY (\`eventsId\`, \`usersId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`events_speakers_users\` (\`eventsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_82ee0582da4c7c1d6ecded6075\` (\`eventsId\`), INDEX \`IDX_eb1259cce9ca45aee5f7603891\` (\`usersId\`), PRIMARY KEY (\`eventsId\`, \`usersId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD CONSTRAINT \`FK_1024d476207981d1c72232cf3ca\` FOREIGN KEY (\`organizerId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_runners_users\` ADD CONSTRAINT \`FK_de97734b854cce9f6178e7ad467\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_runners_users\` ADD CONSTRAINT \`FK_2d4a79a7e5a63020462e96d830a\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_judges_users\` ADD CONSTRAINT \`FK_b763d31ab5cf181ebe43f7ba430\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_judges_users\` ADD CONSTRAINT \`FK_54465a3ec8ea2029f4e2db8ad7e\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_speakers_users\` ADD CONSTRAINT \`FK_82ee0582da4c7c1d6ecded60752\` FOREIGN KEY (\`eventsId\`) REFERENCES \`events\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_speakers_users\` ADD CONSTRAINT \`FK_eb1259cce9ca45aee5f76038911\` FOREIGN KEY (\`usersId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events_speakers_users\` DROP FOREIGN KEY \`FK_eb1259cce9ca45aee5f76038911\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_speakers_users\` DROP FOREIGN KEY \`FK_82ee0582da4c7c1d6ecded60752\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_judges_users\` DROP FOREIGN KEY \`FK_54465a3ec8ea2029f4e2db8ad7e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_judges_users\` DROP FOREIGN KEY \`FK_b763d31ab5cf181ebe43f7ba430\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_runners_users\` DROP FOREIGN KEY \`FK_2d4a79a7e5a63020462e96d830a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events_runners_users\` DROP FOREIGN KEY \`FK_de97734b854cce9f6178e7ad467\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_1024d476207981d1c72232cf3ca\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`id\` \`id\` varchar(36) NOT NULL DEFAULT 'uuid()'`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_eb1259cce9ca45aee5f7603891\` ON \`events_speakers_users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_82ee0582da4c7c1d6ecded6075\` ON \`events_speakers_users\``,
    );
    await queryRunner.query(`DROP TABLE \`events_speakers_users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_54465a3ec8ea2029f4e2db8ad7\` ON \`events_judges_users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_b763d31ab5cf181ebe43f7ba43\` ON \`events_judges_users\``,
    );
    await queryRunner.query(`DROP TABLE \`events_judges_users\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2d4a79a7e5a63020462e96d830\` ON \`events_runners_users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_de97734b854cce9f6178e7ad46\` ON \`events_runners_users\``,
    );
    await queryRunner.query(`DROP TABLE \`events_runners_users\``);
    await queryRunner.query(`DROP TABLE \`events\``);
  }
}
