import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentsTable1700000000001 implements MigrationInterface {
  name = 'CreatePaymentsTable1700000000001';

  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "subscriptionId" uuid NOT NULL,
        "gateway" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "amount" numeric(10,2) NOT NULL,
        "currency" varchar NOT NULL DEFAULT 'BRL',
        "externalReference" varchar,
        "mpPreferenceId" varchar,
        "mpPaymentId" varchar,
        "initPoint" varchar,
        "qrCode" text,
        "qrCodeBase64" text,
        "raw" jsonb,
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz
      )
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE "payments"`);
  }
}
