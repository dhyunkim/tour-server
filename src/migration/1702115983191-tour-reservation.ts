import { MigrationInterface, QueryRunner } from 'typeorm';

export class tourReservation1702115983191 implements MigrationInterface {
  name = 'tourReservation1702115983191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tour_reservation\` (
      \`id\` int NOT NULL AUTO_INCREMENT, 
      \`userId\` int NOT NULL, 
      \`tourId\` int NOT NULL, 
      \`reservationDate\` varchar(10) NOT NULL, 
      \`token\` varchar(50) NOT NULL, 
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      INDEX \`tourId\` (\`tourId\`), 
      INDEX \`token\` (\`token\`), 
      UNIQUE INDEX \`unique_userId_tourId\` (\`userId\`, \`tourId\`), 
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`unique_userId_tourId\` ON \`tour_reservation\``,
    );
    await queryRunner.query(`DROP INDEX \`token\` ON \`tour_reservation\``);
    await queryRunner.query(`DROP INDEX \`tourId\` ON \`tour_reservation\``);
    await queryRunner.query(`DROP TABLE \`tour_reservation\``);
  }
}
