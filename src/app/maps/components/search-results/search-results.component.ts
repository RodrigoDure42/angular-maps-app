import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services';
import { Feature } from '../../interfaces/places.interface';
import { MapsService } from '../../services/maps.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
})
export class SearchResultsComponent {
  private placesService = inject(PlacesService);
  private mapService = inject(MapsService);

  public selectedId?: string;

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature): void {
    this.selectedId = place.id;
    const [lng, lat] = place.center;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature) {
    if (!this.placesService.userLocation)
      throw new Error('User location is required');
    this.placesService.clearPlaces();

    const start = this.placesService.userLocation;
    const end = place.center as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);
  }
}
