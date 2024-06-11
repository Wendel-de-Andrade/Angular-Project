import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {
  private searchQuery: string = '';

  setSearchQuery(query: string): void {
    this.searchQuery = query;
  }

  getSearchQuery(): string {
    return this.searchQuery;
  }
}
