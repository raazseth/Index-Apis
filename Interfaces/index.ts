export interface IComment {
  _id: String;
  postId: String;
  createdBy: String;
  body: String;
}

export interface IPost {
  _id: String;
  createdBy: String;
  title: any;
  body: any;
  postId: Number;
}

export interface ITodo {
  _id: String;
  createdBy: String;
  title: any;
  completed: boolean;
}

interface Company {
  companyName: String;
  catchPhrase: String;
  bs: String;
}
interface Geo {
  lat: Number;
  lng: Number;
}

interface Address {
  street: String;
  suite: String;
  city: String;
  zipcode: Number;
  geo: Geo;
}

export interface IUser {
  _id: String;
  email: string;
  name: String;
  username: String;
  address?: Address;
  phone: Number;
  website?: String;
  company?: Company;
  hash_password: string;
}

export interface IState {
  _id: String;
  name: String;
}

export interface IStateCity {
  _id: String;
  name: String;
  state: String;
}

export interface IIP {
  data: {
    status: String;
    country: String;
    countryCode: String;
    region: String;
    regionName: String;
    city: String;
    zip: String;
    lat: Number | string;
    lon: Number | string;
    timezone: String;
    isp: String;
    org?: String;
    as?: String;
    query: String;
  };
}
