import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserEntity1757795861109 implements MigrationInterface {
  name = 'CreateUserEntity1757795861109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (
      \`id\` varchar(36) NOT NULL DEFAULT (UUID()),
      \`name\` varchar(100) NOT NULL,
      \`nature\` varchar(255) NOT NULL,
      \`email\` varchar(100) NOT NULL,
      \`password\` varchar(255) NOT NULL,
      \`phone\` varchar(20) NULL,
      \`cpf\` varchar(255) NOT NULL,
      \`role\` varchar(255) NOT NULL DEFAULT 'user',
      \`city\` varchar(255) NULL,
      \`state\` varchar(2) NULL,
      \`is_active\` tinyint NOT NULL DEFAULT 1,
      \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
      \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
      UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
      UNIQUE INDEX \`IDX_230b925048540454c8b4c481e1\` (\`cpf\`),
      PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_230b925048540454c8b4c481e1\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
