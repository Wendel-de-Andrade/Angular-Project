import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RickMortyService } from '../../services/rick-morty.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(
    public dialogRef: MatDialogRef<EpisodeDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rickMortyService: RickMortyService
  ) {
    this.episode = data.episode;
  }

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    if (this.episode.characters && this.episode.characters.length > 0) {
      this.rickMortyService.getCharactersByUrls(this.episode.characters).subscribe((characters: any[]) => {
        this.characters = characters;
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
