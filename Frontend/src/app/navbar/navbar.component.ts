import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  public logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  constructor() {}
}
