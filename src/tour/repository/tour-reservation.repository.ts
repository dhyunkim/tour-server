import { EntityRepository, Repository } from 'typeorm';

import { TourReservation } from '../entity';

@EntityRepository(TourReservation)
export class TourReservationRepository extends Repository<TourReservation> {}
