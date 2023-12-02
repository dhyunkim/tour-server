import { MigrationInterface, QueryRunner } from 'typeorm';

export class tourHoliday1701535464938 implements MigrationInterface {
  name = 'tourHoliday1701535464938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tour_holiday\` (
      \`id\` int NOT NULL AUTO_INCREMENT, 
      \`tourId\` int NOT NULL, 
      \`week\` varchar(15) NULL, 
      \`day\` datetime NULL, 
      \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), 
      PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`tour_holiday\``);
  }
}
