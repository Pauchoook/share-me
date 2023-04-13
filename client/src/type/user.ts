export interface IUser {
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  email: string;
  sub: string;
}

export interface IUserDoc {
  _id: string;
  _type: string;
  username: string;
  family_name: string;
  given_name: string;
  picture: string;
  email: string;
}