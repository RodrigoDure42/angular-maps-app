import { Component, inject } from '@angular/core';
import { MapsService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.scss',
})
export class BtnMyLocationComponent {
  //
  private mapsService = inject(MapsService);
  private placesService = inject(PlacesService);

  goToMyLocation() {
    if (!this.placesService.isUserLocationReady)
      throw new Error('User location is not ready');

    this.mapsService.flyTo(this.placesService.userLocation!);
  }
}
