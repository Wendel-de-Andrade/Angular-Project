import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RickMortyService } from '../../services/rick-morty.service';
import { MatDialog } from '@angular/material/dialog';
import { EpisodeDetailsComponent } from '../episode-details/episode-details.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../core/card/card.component';
import { SearchBarComponent } from '../../core/search-bar/search-bar.component';

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
  totalEpisodes: number = 1;
  totalPages: number = 0;

  constructor(private rickMortyService: RickMortyService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadEpisodes(1);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const threshold = 150; // Distância do final da pagina para carregar mais episódios
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;

    if (position + threshold >= height) {
      this.loadMore();
    }
  }

  loadEpisodes(page: number): void {
    this.isLoading = true;
    this.rickMortyService.getEpisodes(page, this.searchQuery).subscribe({
      next: (res: any) => {
        this.episodes = this.episodes.concat(res.results);
        this.totalEpisodes = res.info.count;
        this.totalPages = res.info.pages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar os episódios:', error);
        this.isLoading = false;
      }
    });
  }

  loadMore(): void {
    if (!this.isLoading && this.page < this.totalPages) {
      this.page++;
      this.loadEpisodes(this.page);
    }
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.page = 1;
    this.episodes = [];
    this.loadEpisodes(this.page);
  }

  openEpisodeModal(episode: any): void {
    this.dialog.open(EpisodeDetailsComponent, {
      width: '500px',
      data: { episode }
    });
  }
}
