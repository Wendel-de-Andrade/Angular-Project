import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CharacterListComponent } from './character/character-list/character-list.component';
import { CharacterDetailsComponent } from './character/character-details/character-details.component';
import { UserProfileComponent } from './core/user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';
import { EpisodeListComponent } from './episode/episode-list/episode-list.component';
import { EpisodeDetailsComponent } from './episode/episode-details/episode-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      { path: 'characters', component: CharacterListComponent },
      { path: 'character/:id', component: CharacterDetailsComponent },
      { path: 'episodes', component: EpisodeListComponent },
      { path: 'episode/:id', component: EpisodeDetailsComponent },
      { path: 'profile', component: UserProfileComponent },
    ]
  },
];
