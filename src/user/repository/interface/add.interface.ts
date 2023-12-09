import { Gender } from '../../enum';

export interface IAdd {
  email: string;
  password: string;
  name: string;
  gender?: Gender;
  birthYear?: number;
}
