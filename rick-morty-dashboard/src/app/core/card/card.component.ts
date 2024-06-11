import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() imageUrl: string | null = null;
  @Input() title: string = '';
  @Input() text: string = '';
  @Input() link: string = '';
  @Input() linkText: string = 'Details';
  @Output() detailClick = new EventEmitter<void>();

  onDetailClick(): void {
    this.detailClick.emit();
  }
}
