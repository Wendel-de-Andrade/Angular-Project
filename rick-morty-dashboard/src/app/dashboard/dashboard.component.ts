import { Component } from '@angular/core';
import { NavbarComponent } from '../core/navbar/navbar.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../core/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterLink, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
