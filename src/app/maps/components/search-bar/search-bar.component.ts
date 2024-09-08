import { Component, inject } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  private placesService = inject(PlacesService);

  private debounceTimer?: NodeJS.Timeout;

  onQueryChange(query: string = '') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
    }, 300);
  }
}
