import { EntityRepository, Repository } from 'typeorm';
import { Tour } from '../entity';

@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {}
