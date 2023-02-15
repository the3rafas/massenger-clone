import { Injectable } from '@nestjs/common';
import { LangEnum } from 'src/user/user.enum';
import { countries } from './countries';
import { CountryNameAnd2IsoCode } from './country.type';

@Injectable()
export class CountryService {
  constructor() {}

  countries(lang: LangEnum) {
    let object: CountryNameAnd2IsoCode;
    let returnAllCountries: CountryNameAnd2IsoCode[] = [];

    for (let key in countries) {
      object = {
        localeName: lang == LangEnum.EN ? countries[key].EN : countries[key].AR,
        isoCode: key
      };

      returnAllCountries.push(object);
    }
    return returnAllCountries;
  }
}
