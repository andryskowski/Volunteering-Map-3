import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService, User } from '../user-service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.html',
  styleUrls: ['./user-info.scss'],
  imports: [CommonModule],
})
export class UserInfoComponent implements OnInit {
  user: User | null = null;
  loading = true;
  error: string | null = null;
  defaultAvatar: string = 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png';;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idStr = params.get('id');
      if (!idStr) {
        this.error = 'User ID not provided';
        this.loading = false;
        return;
      }

      const id = Number(idStr);
      this.loading = true;
      this.userService.getUserById(id).subscribe({
        next: (user) => {
          console.log(user);
          this.user = user;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load user';
          this.loading = false;
        },
      });
    });
  }

  onAvatarError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultAvatar;
  }
}