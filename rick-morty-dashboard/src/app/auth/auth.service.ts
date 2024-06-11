import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private user = { name: 'User', email: 'user@example.com' };

  login(username: string, password: string): boolean {
    // Lógica de Login (Mock)
    this.isLoggedIn = true;
    return this.isLoggedIn;
  }

  logout(): void {
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getUser(): { name: string, email: string } {
    return this.user;
  }
}
