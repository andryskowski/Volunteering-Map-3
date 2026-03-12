export interface Place {
  _id: number;
  name: string;
  img: string;
  city: string;
  street: string;
  houseNo: string;
  postalCode: string;
  category: string;
  district: string;
  date: Date;
  shortDescription: string;
  lat?: number;
  lng?: number;
}
