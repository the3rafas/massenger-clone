import { Context, Query, Resolver } from '@nestjs/graphql';
import { GqlCountriesArrayResponse } from './country.response';
import { CountryNameAnd2IsoCode } from './country.type';
import { CountryService } from './country.service';
import { LangEnum } from '../../user/user.enum';

@Resolver(of => CountryNameAnd2IsoCode)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Query(() => GqlCountriesArrayResponse)
  countries(@Context('lang') lang: LangEnum) {
    return this.countryService.countries(lang);
  }
}
