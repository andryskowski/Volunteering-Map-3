import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, finalize } from 'rxjs';
import { User, UserService } from '../user-service';
import { LoaderComponent } from '../loader/loader';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  template: `
    <ng-container *ngIf="!(loading$ | async); else loader">
      <h2>Users</h2>

      <ul>
        <li *ngFor="let user of users">
          {{ user.login }} ({{ user.role }})
          <button (click)="deleteUser(user._id)">Delete</button>
        </li>
      </ul>

      <div *ngIf="users.length === 0">
        No users found.
      </div>
    </ng-container>

    <ng-template #loader>
      <app-loader></app-loader>
    </ng-template>
  `
})
export class UserPanel implements OnInit {

  users: User[] = [];

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loadingSubject.next(true);

    this.userService.getUsers()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: users => this.users = users,
        error: err => {
          console.error(err);
          this.users = [];
        }
      });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => this.fetchUsers(),
      error: err => console.error(err)
    });
  }
}