import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { CommonModule } from '@angular/common';

interface User {
  _id: number;
  login: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.html',
  styleUrls: ['./user-info.scss'],
  imports: [CommonModule]
})
export class UserInfoComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
    }
  }
}