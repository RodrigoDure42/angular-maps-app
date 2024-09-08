import { inject, Injectable } from '@angular/core';
import {
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
  Popup,
  SourceSpecification,
} from 'mapbox-gl';
import { DirectionsApiClient } from '../api/directionsApiClient';
import { DirectionsResponse, Route } from '../interfaces/directions.interface';
import { Feature } from '../interfaces/places.interface';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  private map?: Map;
  private markers: Marker[] = [];

  private apiClient = inject(DirectionsApiClient);

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map): void {
    this.map = map;
  }

  flyTo(coords: LngLatLike): void {
    if (!this.isMapReady) throw new Error('Map is not ready');
    this.map?.flyTo({ center: coords, zoom: 14 });
  }

  createdMarkersFromPlaces(
    places: Feature[],
    userLocation: [number, number]
  ): void {
    if (!this.isMapReady) throw new Error('Map is not ready');
    this.markers.forEach((marker) => marker.remove());
    const newMarkers = [];
    for (const place of places) {
      const [lng, lat] = place.center;
      const popup = new Popup().setHTML(`
        <h6>${place.text}</h6>
        <p>${place.place_name}</p>
      `);
      const marker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map!);
      newMarkers.push(marker);
    }
    this.markers = newMarkers;

    if (places.length === 0) return;
    const bounds = new LngLatBounds();
    newMarkers.forEach((marker) => bounds.extend(marker.getLngLat()));
    bounds.extend(userLocation);
    this.map?.fitBounds(bounds, { padding: 200 });
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]): void {
    this.apiClient
      .get<DirectionsResponse>(`/${start.join(',')};${end.join(',')}`)
      .subscribe((resp: DirectionsResponse) => {
        this.drawPolyline(resp.routes[0]);
      });
  }

  private drawPolyline(route: Route): void {
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });
    if (!this.isMapReady) throw new Error('Map is not ready');

    const coords = route.geometry.coordinates;
    const bounds = new LngLatBounds();
    coords.forEach(([lng, lat]) => bounds.extend([lng, lat]));

    this.map?.fitBounds(bounds, {
      padding: 200,
    });

    // Polyline
    const sourceData: SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };

    if (this.map?.getSource('RouteString')) {
      this.map?.removeLayer('RouteString');
      this.map?.removeSource('RouteString');
    }

    this.map?.addSource('RouteString', sourceData);
    this.map?.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      },
    });
  }
}
