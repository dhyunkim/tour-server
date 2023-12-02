import { MigrationInterface, QueryRunner } from 'typeorm';

export class tourReservation1701526176493 implements MigrationInterface {
  name = 'tourReservation1701526176493';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tour_reservation\` (
      \`id\` int NOT NULL AUTO_INCREMENT, 
      \`customerId\` int NOT NULL, 
      \`tourId\` int NOT NULL, 
      \`reservedAt\` datetime NOT NULL, 
      \`token\` varchar(255) NOT NULL, 
      \`tokenStatus\` tinyint NOT NULL DEFAULT 1, 
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      INDEX \`customerId\` (\`customerId\`), 
      INDEX \`token\` (\`token\`), 
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`token\` ON \`tour_reservation\``);
    await queryRunner.query(
      `DROP INDEX \`customerId\` ON \`tour_reservation\``,
    );
    await queryRunner.query(`DROP TABLE \`tour_reservation\``);
  }
}
