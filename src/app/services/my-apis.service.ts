import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Nationality, Ip, Country } from '../Interfaces/interface';
/* use those apis to get user geolocations and nationality all apis accept get request
https://backofficeapi.khaleejgate.com/api/GetAllCountriesByLangName?LangCode=en
returns all countries with country codes
*********
https://api.ipify.org/?format=json
returns users ip adress
*********
use ip adress to get user geo location and country
https://ipapi.co/${ip-adress}/json/
*/

@Injectable({
  providedIn: 'root',
})
export class MyApisService {
  constructor(private http: HttpClient) {}
  getIpWithGeoLocation(): Observable<{ ip: Ip; nationality: Nationality }> {
    return this.http
      .get<Ip>(environment.IpApi)
      .pipe(
        concatMap((ip: Ip) =>
          this.http
            .get<Nationality>(`https://ipapi.co/${ip?.ip}/json/`)
            .pipe(map((nationality: Nationality) => ({ ip, nationality })))
        )
      );
  }
  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(environment.baseApi);
  }
}
