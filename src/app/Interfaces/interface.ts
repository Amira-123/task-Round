export interface Ip {
  ip?: string;
}
export interface Nationality extends Ip {
  country_name: string;
}
export interface Country {
  countryName: string;
}
