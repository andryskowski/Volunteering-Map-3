import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../auth-service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../modal-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
