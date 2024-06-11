import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  constructor(private http: HttpClient) {}

  // Métodos para personagens
  getCharacters(page: number, name?: string): Observable<any> {
    let url = `${this.apiUrl}/character/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url);
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`);
  }

  getCharacterByUrl(url: string): Observable<any> {
    return this.http.get(url);
  }

  // Métodos para episódios
  getEpisodes(page: number, name?: string): Observable<any> {
    let url = `${this.apiUrl}/episode/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url);
  }

  getEpisodeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`);
  }

  getCharactersByUrls(urls: string[]): Observable<any[]> {
    return forkJoin(urls.map(url => this.http.get(url)));
  }
}
