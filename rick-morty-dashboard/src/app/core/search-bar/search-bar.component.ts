import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchStateService } from '../../services/search-state.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();
  searchQuery: string = '';
  searchSubject: Subject<string> = new Subject<string>(); // Adiciona um Subject para a pesquisa

  constructor(private searchStateService: SearchStateService) {}

  ngOnInit(): void {
    this.searchQuery = this.searchStateService.getSearchQuery(); // Recupera o estado da pesquisa

    // Configura o debounce para a pesquisa
    this.searchSubject.pipe(
      debounceTime(300) // Tempo de debounce em milissegundos
    ).subscribe(query => {
      this.searchStateService.setSearchQuery(query); // Atualiza o estado da pesquisa
      this.search.emit(query);
    });
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery); // Envia o valor da pesquisa para o Subject
  }

  preventSubmit(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault(); // Evita a submissão ao pressionar "ENTER"
    }
  }
}
