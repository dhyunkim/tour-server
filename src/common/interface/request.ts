import { Role } from '../../auth/enum';

export type IUser = {
  id: number;
  role: Role;
  exp: number;
};

export interface IRequest {
  ip: string;
  userAgent: string;
  user?: IUser;
}
