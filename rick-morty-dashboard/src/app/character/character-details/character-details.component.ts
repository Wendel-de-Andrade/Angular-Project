import { Component, OnInit, Inject, Optional } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RickMortyService } from '../../services/rick-morty.service';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss']
})
export class CharacterDetailsComponent implements OnInit {
  character: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rickMortyService: RickMortyService,
    @Optional() public dialogRef: MatDialogRef<CharacterDetailsComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data) {
      // Modal mode
      this.character = this.data;
    } else {
      // Route mode
      this.route.paramMap.subscribe(params => {
        const id = +params.get('id')!;
        this.rickMortyService.getCharacterById(id).subscribe(data => {
          this.character = data;
        });
      });
    }
  }

  closeModal(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    } else {
      this.router.navigate(['/dashboard/characters']);
    }
  }
}
