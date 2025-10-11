import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInfosInDatabase1760214029844 implements MigrationInterface {
  name = 'AddInfosInDatabase1760214029844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO 
        "users" (name, email, password, cpf, phone, nature, role, city, state, is_active, "createdAt", "createdFunctionName", "createdUserId")
      VALUES 
        ('Admin', 'admin@example.com', '$2b$10$1woJrTW.lZhao4gc04Q7c.JUWKc3tYyF3KONJrPCRA1Cig11V46ni', '12345678901', '1234567890', 'male', 'admin', 'Admin City', 'Admin State', true, NOW(), 'createAdminUser', 'c11a6bb0-fcb9-4693-998f-032a8dfff864')`);

    await queryRunner.query(`INSERT INTO 
        "categories" ("createdAt", "createdUserId", "createdFunctionName", name, description)
      VALUES 
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'professional', 'Categoria destinada a competidores profissionais.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'junior', 'Categoria destinada a competidores amadores.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'feminine', 'Categoria exclusiva para competidoras do sexo feminino.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'intermediary', 'Categoria para jovens competidores, geralmente com idade limitada.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'derby', 'Categoria para cavalos jovens.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'aspirant', 'Categoria para competidores iniciantes.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'master', 'Categoria destinada a competidores experientes.'),
        (NOW(), 'c11a6bb0-fcb9-4693-998f-032a8dfff864', 'AddInfosInDatabase.up', 'young', 'Categoria para jovens competidores.');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "categories" WHERE name IN (
      'professional', 
      'junior', 
      'feminine', 
      'intermediary', 
      'derby', 
      'aspirant', 
      'master', 
      'young'
    )`);

    await queryRunner.query(`DELETE FROM "users"`);
  }
}
