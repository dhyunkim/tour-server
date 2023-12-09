import { Role } from '../../auth/enum';

export type IUser = {
  id: number;
  role: Role;
  exp: number;
  refresh?: boolean;
};

export interface IRequest {
  ip: string;
  userAgent: string;
  user?: IUser;
}
