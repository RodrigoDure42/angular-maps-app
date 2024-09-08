import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { MapsService, PlacesService } from '../../services';
import { Map, Marker, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
})
export class MapViewComponent implements AfterViewInit {
  @ViewChild('mapDiv', { static: true })
  mapDivElement!: ElementRef;

  private placesService = inject(PlacesService);

  private mapsService = inject(MapsService);

  ngAfterViewInit(): void {
    if (!this.placesService.userLocation)
      throw new Error('User location not found');
    const map = new Map({
      container: this.mapDivElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 9, // starting zoom
    });

    const popup = new Popup({ closeOnClick: false }).setHTML('Here i am');

    new Marker({ color: 'red' })
      .setLngLat(this.placesService.userLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapsService.setMap(map);
  }
}
