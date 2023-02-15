import { Module } from '@nestjs/common';
import { CountryResolver } from './countries.resolver';
import { CountryService } from './country.service';

@Module({
  providers: [CountryService, CountryResolver],
  exports: [CountryService]
})
export class CountryModule {}
