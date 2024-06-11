import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, forkJoin } from 'rxjs';
import { format, parse } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class RickMortyService {
  private apiUrl = 'https://rickandmortyapi.com/api';

  // Mapeamento de tradução para espécies, gênero, status e origem
  private translationMap: { [key: string]: { [key: string]: string } } = {
    species: {
      'Human': 'Humano',
      'Alien': 'Alienígena',
      'Robot': 'Robô',
      'unknown': 'Desconhecido',
      // Adicione mais traduções conforme necessário
    },
    gender: {
      'Male': 'Masculino',
      'Female': 'Feminino',
      'Genderless': 'Sem Gênero',
      'unknown': 'Desconhecido',
      // Adicione mais traduções conforme necessário
    },
    status: {
      'Alive': 'Vivo',
      'Dead': 'Morto',
      'unknown': 'Desconhecido',
      // Adicione mais traduções conforme necessário
    },
    origin: {
      'Earth (C-137)': 'Terra (C-137)',
      'unknown': 'Desconhecido',
      // Adicione mais traduções conforme necessário
    }
  };

  constructor(private http: HttpClient) {}

  // Método para traduzir valores com base no tipo e chave
  private translateValue(type: string, value: string): string {
    return this.translationMap[type][value] || value;
  }

  // Método para traduzir e formatar dados do episódio
  private formatEpisodeData(episode: any): any {
    return {
      ...episode,
      air_date: this.formatDate(episode.air_date)
    };
  }

  // Método para traduzir dados do personagem
  private translateCharacterData(character: any): any {
    return {
      ...character,
      species: this.translateValue('species', character.species),
      gender: this.translateValue('gender', character.gender),
      status: this.translateValue('status', character.status),
      origin: {
        ...character.origin,
        name: this.translateValue('origin', character.origin.name)
      }
    };
  }

  // Método para formatar data
  private formatDate(dateString: string): string {
    const parsedDate = parse(dateString, 'MMMM d, yyyy', new Date());
    return format(parsedDate, 'dd/MM/yyyy');
  }

  // Métodos para personagens
  getCharacters(page: number, name?: string): Observable<any> {
    let url = `${this.apiUrl}/character/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url).pipe(
      map((response: any) => {
        response.results = response.results.map((character: any) => this.translateCharacterData(character));
        return response;
      })
    );
  }

  getCharacterById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/character/${id}`).pipe(
      map((character: any) => this.translateCharacterData(character))
    );
  }

  getCharacterByUrl(url: string): Observable<any> {
    return this.http.get(url).pipe(
      map((character: any) => this.translateCharacterData(character))
    );
  }

  // Métodos para episódios
  getEpisodes(page: number, name?: string): Observable<any> {
    let url = `${this.apiUrl}/episode/?page=${page}`;
    if (name) {
      url += `&name=${name}`;
    }
    return this.http.get(url).pipe(
      map((response: any) => {
        response.results = response.results.map((episode: any) => this.formatEpisodeData(episode));
        return response;
      })
    );
  }

  getEpisodeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/episode/${id}`).pipe(
      map((episode: any) => this.formatEpisodeData(episode))
    );
  }

  getCharactersByUrls(urls: string[]): Observable<any[]> {
    return forkJoin(urls.map(url => this.http.get(url))).pipe(
      map((characters: any[]) => characters.map(character => this.translateCharacterData(character)))
    );
  }
}
