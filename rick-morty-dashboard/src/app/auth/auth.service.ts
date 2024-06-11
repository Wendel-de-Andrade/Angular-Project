import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private user: { name: string, email: string } = { name: 'Usuário', email: 'user@example.com' };

  login(username: string, password: string): boolean {
    // Lógica de Login (Mock)
    this.isLoggedIn = true;
    this.user.name = username.trim() ? username : 'Usuário'; // Define "Usuário" se o campo estiver vazio
    return this.isLoggedIn;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.user.name = 'Usuário'; // Reseta o nome de usuário ao fazer logout
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUser(): { name: string, email: string } {
    return this.user;
  }
}
