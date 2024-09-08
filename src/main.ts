import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Mapboxgl from 'mapbox-gl';
import { AppModule } from './app/app.module';

Mapboxgl.accessToken =
  'pk.eyJ1Ijoicm9kcmlnb2R1cmU0MiIsImEiOiJjbHZyZXB6OGEwbzBsMmpwZ2o5bTc3YzRuIn0.NNU5aMOsJTuGTZbkn0gvzw';

if (!navigator.geolocation) {
  throw new Error('El navegador no soporta la geolocalizacion');
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch((err) => console.error(err));
