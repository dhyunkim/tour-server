import { MigrationInterface, QueryRunner } from 'typeorm';

export class user1702121927451 implements MigrationInterface {
  name = 'user1702121927451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (
      \`id\` int NOT NULL AUTO_INCREMENT, 
      \`name\` varchar(20) NOT NULL, 
      \`email\` varchar(255) NOT NULL, 
      \`password\` varchar(255) NOT NULL, 
      \`gender\` enum ('FEMALE', 'MALE') NULL, 
      \`birthYear\` int NULL, 
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`deletedAt\` datetime(6) NULL, 
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
