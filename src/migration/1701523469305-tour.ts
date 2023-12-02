import { MigrationInterface, QueryRunner } from 'typeorm';

export class tour1701523469305 implements MigrationInterface {
  name = 'tour1701523469305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tour\` (
      \`id\` int NOT NULL AUTO_INCREMENT, 
      \`sellerId\` int NOT NULL, 
      \`title\` varchar(250) NOT NULL, 
      \`reservationLimit\` int NOT NULL DEFAULT '5', 
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), 
      \`deletedAt\` datetime(6) NULL, 
      INDEX \`sellerId\` (\`sellerId\`), 
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`sellerId\` ON \`tour\``);
    await queryRunner.query(`DROP TABLE \`tour\``);
  }
}
