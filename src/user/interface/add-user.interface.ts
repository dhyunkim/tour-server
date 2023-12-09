import { Gender } from '../enum';

export interface IAddUser {
  email: string;
  password: string;
  name: string;
  gender?: Gender;
  birthYear?: number;
}
