import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrl: './map-screen.component.scss',
})
export class MapScreenComponent {
  private placesService = inject(PlacesService);

  get isUserLocationReady(): boolean {
    return this.placesService.isUserLocationReady;
  }
}
