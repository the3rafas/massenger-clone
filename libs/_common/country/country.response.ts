import { generateGqlResponseType } from '../graphql/graphql-response.type';
import { CountryNameAnd2IsoCode } from './country.type';

export const GqlCountriesArrayResponse = generateGqlResponseType(
  Array(CountryNameAnd2IsoCode),
  true
);
