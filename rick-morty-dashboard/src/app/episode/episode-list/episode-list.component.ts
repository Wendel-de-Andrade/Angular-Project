import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RickMortyService } from '../../services/rick-morty.service';
import { MatDialog } from '@angular/material/dialog';
import { EpisodeDetailsComponent } from '../episode-details/episode-details.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../core/card/card.component';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';
import { SearchStateService } from '../../services/search-state.service';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, SearchBarComponent],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss']
})
export class EpisodeListComponent implements OnInit {
  episodes: any[] = [];
  page: number = 1;
  searchQuery: string = '';
  isLoading: boolean = false;
  isLoadingMore: boolean = false; // Flag para carregamento adicional
  totalEpisodes: number = 1;
  totalPages: number = 0;
  showScrollToTop: boolean = false; // Flag para mostrar o botão de scroll para o topo

  constructor(
    private rickMortyService: RickMortyService,
    private searchStateService: SearchStateService, // Injeta o serviço de estado de pesquisa
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchQuery = this.searchStateService.getSearchQuery(); // Recupera o estado da pesquisa
    this.loadEpisodes(1);
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

  loadEpisodes(page: number): void {
    if (page === 1) {
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    this.rickMortyService.getEpisodes(page, this.searchQuery).subscribe({
      next: (res: any) => {
        if (page === 1) {
          this.episodes = res.results;
        } else {
          this.episodes = this.episodes.concat(res.results);
        }
        this.totalEpisodes = res.info.count;
        this.totalPages = res.info.pages;
        this.isLoading = false;
        this.isLoadingMore = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os episódios:', error);
        this.isLoading = false;
        this.isLoadingMore = false;
      }
    });
  }

  loadMore(): void {
    if (!this.isLoading && !this.isLoadingMore && this.page < this.totalPages) {
      this.page++;
      this.loadEpisodes(this.page);
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.episodes = [];
    this.loadEpisodes(this.page);
    window.scrollTo(0, 0); // Volta ao topo ao fazer nova pesquisa
  }

  openEpisodeModal(episode: any): void {
    this.dialog.open(EpisodeDetailsComponent, {
      width: '500px',
      data: { episode }
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Volta ao topo suavemente
  }
}
