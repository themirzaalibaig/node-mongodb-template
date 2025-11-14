import { ActiveType, IdentifiableType, TimestampType } from './';

export interface Test extends TimestampType, ActiveType, IdentifiableType {
  firstName: string;
  lastName: string;
  email: string;
}
