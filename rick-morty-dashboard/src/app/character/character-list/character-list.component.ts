import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RickMortyService } from '../../services/rick-morty.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { CardComponent } from '../../core/card/card.component';
import { CharacterDetailsComponent } from '../character-details/character-details.component';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBarComponent, CardComponent, CharacterDetailsComponent],
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit {
  characters: any[] = [];
  page: number = 1;
  searchQuery: string = '';
  isLoading: boolean = false;
  totalCharacters: number = 1;
  totalPages: number = 0;

  constructor(private rickMortyService: RickMortyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCharacters(1);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 150; // Distância do final da pagina para carregar mais personagens
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (position + threshold >= height) {
      this.loadMore();
    }
  }

  loadCharacters(page: number): void {
    this.isLoading = true;
    this.rickMortyService.getCharacters(page, this.searchQuery).subscribe({
      next: (res: any) => {
        this.characters = this.characters.concat(res.results);
        this.totalCharacters = res.info.count;
        this.totalPages = res.info.pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os personagens:', error);
        this.isLoading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.isLoading && this.page < this.totalPages) {
      this.page++;
      this.loadCharacters(this.page);
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.characters = [];
    this.loadCharacters(this.page);
  }

  openCharacterModal(character: any): void {
    this.dialog.open(CharacterDetailsComponent, {
      data: character
    });
  }
}
