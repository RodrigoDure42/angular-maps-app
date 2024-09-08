import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PlacesApiClient } from '../api/placesApiClient';
import { Feature, PlacesResponse } from '../interfaces/places.interface';
import { MapsService } from './maps.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private http = inject(PlacesApiClient);
  private mapService = inject(MapsService);

  public userLocation?: [number, number];

  public isLoadingPlaces = false;
  public places: Feature[] = [];

  get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  constructor() {
    this.getUserLocation();
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
          resolve(this.userLocation);
        },
        (error) => {
          alert('No se pudo obtener la geolocalización');
          reject(new Error(error.message));
        }
      );
    });
  }

  getPlacesByQuery(query: string = '') {
    this.isLoadingPlaces = true;
    this.http
      .get<PlacesResponse>(`${query}.json`, {
        params: {
          proximity: `${this.userLocation?.join(',')}`,
        },
      })
      .subscribe({
        next: (data: PlacesResponse) => {
          this.places = data.features;
          this.mapService.createdMarkersFromPlaces(
            this.places,
            this.userLocation!
          );
        },
        error: (error: HttpErrorResponse) => console.log(error),
        complete: () => (this.isLoadingPlaces = false),
      });
  }

  clearPlaces(): void {
    this.places = [];
  }
}
