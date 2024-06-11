import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RickMortyService } from '../../services/rick-morty.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AllCharactersComponent } from '../all-characters/all-characters.component';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode: any;
  characters: any[] = [];
  visibleCharacters: any[] = [];
  hasMoreCharacters: boolean = false;
  maxVisibleCharacters: number = 18; // Define o número máximo de personagens visíveis
  isLoading: boolean = true; // Flag para controle do spinner de carregamento

  constructor(
    public dialogRef: MatDialogRef<EpisodeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rickMortyService: RickMortyService,
    private dialog: MatDialog
  ) {
    this.episode = data.episode;
  }

  ngOnInit(): void {
    this.loadCharacters();
    this.adjustVisibleCharactersForScreenSize();
    window.addEventListener('resize', this.adjustVisibleCharactersForScreenSize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.adjustVisibleCharactersForScreenSize.bind(this));
  }

  loadCharacters(): void {
    if (this.episode.characters && this.episode.characters.length > 0) {
      this.rickMortyService.getCharactersByUrls(this.episode.characters).subscribe((characters: any[]) => {
        this.characters = characters;
        this.updateVisibleCharacters();
        this.isLoading = false; // Desativa o spinner de carregamento
      });
    } else {
      this.isLoading = false; // Desativa o spinner de carregamento se não houver personagens
    }
  }

  adjustVisibleCharactersForScreenSize(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 576) {
      this.maxVisibleCharacters = 12; // Reduz o número de personagens visíveis em telas menores
    } else {
      this.maxVisibleCharacters = 18;
    }
    this.updateVisibleCharacters();
  }

  updateVisibleCharacters(): void {
    if (this.characters.length > this.maxVisibleCharacters) {
      this.visibleCharacters = this.characters.slice(0, this.maxVisibleCharacters - 1);
      this.hasMoreCharacters = true;
    } else {
      this.visibleCharacters = this.characters;
      this.hasMoreCharacters = false;
    }
  }

  showAllCharacters(): void {
    this.dialog.open(AllCharactersComponent, {
      width: '80%',
      data: { characters: this.characters }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
