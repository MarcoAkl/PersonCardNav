export type Role = 'admin' | 'moderator' | 'user';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

export interface Company {
  department: string;
  name: string;
  title: string;
  address: Address;
}

export interface Hair {
  color: string;
  type: string;
}

export interface Bank {
  cardExpire: string;
  cardNumber: string;
  cardType: string;
  currency: string;
  iban: string;
}

export interface Crypto {
  coin: string;
  wallet: string;
  network: string;
}

/** Slim shape used for grid cards, requested via the API's `select` param. */
export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  age: number;
  role: Role;
  company: Pick<Company, 'name' | 'title'>;
}

/** Full record returned by GET /users/{id}. */
export interface User extends UserSummary {
  maidenName: string;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: Hair;
  address: Address;
  university: string;
  bank: Bank;
  company: Company;
  crypto: Crypto;
}

export interface UsersResponse<T = UserSummary> {
  users: T[];
  total: number;
  skip: number;
  limit: number;
}
