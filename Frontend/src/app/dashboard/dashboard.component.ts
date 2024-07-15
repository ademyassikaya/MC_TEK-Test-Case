import { Component, inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  authService = inject(AuthService);
  router = inject(Router);
  public logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
