import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from '../../../environments/environments.prod';

@Injectable({
  providedIn: 'root',
})
export class PlacesApiClient extends HttpClient {
  public baseUrl: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(
    url: string,
    options: {
      params?:
        | HttpParams
        | {
            [param: string]:
              | string
              | number
              | boolean
              | ReadonlyArray<string | number | boolean>;
          };
    }
  ): any {
    url = this.baseUrl + url;
    return super.get<T>(url, {
      params: {
        limit: 5,
        language: 'es',
        access_token: environments.apiKey,
        ...options.params,
      },
    });
  }
}
