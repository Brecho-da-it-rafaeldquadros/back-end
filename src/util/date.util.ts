import { format } from 'date-fns';

export const getCurrentDateMileseconds = (): number => {
  let milesecondsUTC = Date.parse(new Date().toISOString())

  const currentMileseconds = milesecondsUTC -= 10800000

  return currentMileseconds
}

export const transformDateInMileseconds = (date: string): number => {
  return Date.parse(new Date(date).toISOString());
};

export const generateDatePerMileseconds = (mileseconds: number): string => {
  return new Date(mileseconds).toISOString();
};

export const transformsPTBRFormat = () => {
  
  return generateDatePerMileseconds( getCurrentDateMileseconds() )
}

export const createDateFormtExpirationMercadoPago = ( str:string ) => {
  
  const isoDate = '2022-11-17T09:37:52.000-04:00';
  const date = new Date(str);
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx").slice(0,23) + "-04:00"
}