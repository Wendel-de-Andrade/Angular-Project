import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed: boolean = true;
  isTransitioning: boolean = false;
  lastToggleTime: number = 0;
  debounceTime: number = 400; // 400 ms debounce time

  constructor(private router: Router) {}

  toggleSidebar(): void {
    const currentTime = Date.now();
    if (this.isTransitioning || currentTime - this.lastToggleTime < this.debounceTime) {
      return; // Se uma transição estiver em andamento ou dentro do tempo de debounce, ignore o clique
    }

    this.lastToggleTime = currentTime;
    this.isTransitioning = true;

    if (this.isCollapsed) {
      this.isCollapsed = !this.isCollapsed;
      this.isTransitioning = false; // Permitir cliques imediatamente após a expansão
    } else {
      setTimeout(() => {
        this.isCollapsed = !this.isCollapsed;
        this.isTransitioning = false; // Permitir cliques após o fechamento
      }, 400);
    }
  }

  isActive(url: string): boolean {
    return this.router.isActive(url, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }
}
