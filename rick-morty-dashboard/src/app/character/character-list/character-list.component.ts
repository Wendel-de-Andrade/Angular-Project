import { Component, HostListener, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RickMortyService } from '../../services/rick-morty.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { CardComponent } from '../../core/card/card.component';
import { CharacterDetailsComponent } from '../character-details/character-details.component';
import { SearchStateService } from '../../services/search-state.service';

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
  isLoadingMore: boolean = false; // Flag para carregamento adicional
  totalCharacters: number = 1;
  totalPages: number = 0;
  showScrollToTop: boolean = false; // Flag para mostrar o botão de scroll para o topo

  constructor(
    private rickMortyService: RickMortyService,
    private searchStateService: SearchStateService, // Injeta o serviço de estado de pesquisa
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchQuery = this.searchStateService.getSearchQuery(); // Recupera o estado da pesquisa
    this.loadCharacters(1);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 150;
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (position + threshold >= height) {
      this.loadMore();
    }

    // Mostrar ou ocultar o botão de scroll para o topo
    this.showScrollToTop = window.scrollY > 300;
  }

  loadCharacters(page: number): void {
    if (page === 1) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    this.rickMortyService.getCharacters(page, this.searchQuery).subscribe({
      next: (res: any) => {
        if (page === 1) {
          this.characters = res.results;
        } else {
          this.characters = this.characters.concat(res.results);
        }
        this.totalCharacters = res.info.count;
        this.totalPages = res.info.pages;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os personagens:', error);
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  loadMore(): void {
    if (!this.isLoading && !this.isLoadingMore && this.page < this.totalPages) {
      this.page++;
      this.loadCharacters(this.page);
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.characters = [];
    this.loadCharacters(this.page);
    window.scrollTo(0, 0); // Volta ao topo ao fazer nova pesquisa
  }

  openCharacterModal(character: any): void {
    this.dialog.open(CharacterDetailsComponent, {
      data: character
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo suavemente
  }
}
