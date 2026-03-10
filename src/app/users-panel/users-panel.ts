import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../user-service';
import { EntityPanelComponent } from '../entity-panel/entity-panel';
import { BehaviorSubject, finalize, tap } from 'rxjs';
import { ModalService } from '../modal-service';
import { EditEntityFormComponent } from '../edit-entity-form/edit-entity-form';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-users-panel',
  standalone: true,
  imports: [CommonModule, EntityPanelComponent],
  template: `
    <app-entity-panel
      [title]="'Users'"
      [entities]="users"
      [columns]="['login', 'role', 'email', 'avatarUrl']"
      [deleteFn]="deleteUserFn"
      [editFn]="editUserFn"
      [loading$]="loading$"
    >
    </app-entity-panel>
  `,
})
export class UsersPanel implements OnInit {
  users: User[] = [];

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.fetchUsers();

    this.modalService.modalState$.subscribe((state) => {
      if (!state.visible) {
        this.fetchUsers();
      }
    });
  }

  fetchUsers() {
    this.loadingSubject.next(true);

    this.userService
      .getUsers()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (users) => {
          this.users = users;
        },
        error: (err) => {
          console.error(err);
          this.users = [];
        },
      });
  }

  deleteUserFn = (id: string | number) => {
    return this.userService.deleteUser(Number(id)).pipe(
      finalize(() => {
        this.fetchUsers();
      }),
    );
  };

  editUserFn = (user: User) => {
    this.modalService.open('Edit User', EditEntityFormComponent, {
      entity: user,
      fields: [
        { name: 'login', label: 'Login', validators: [Validators.required] },
        { name: 'email', label: 'Email', validators: [Validators.required, Validators.email] },
        { name: 'avatarUrl', label: 'Avatar URL' },
        { name: 'role', label: 'Role', type: 'select', options: ['user', 'admin', 'moderator'] },
      ],
      submitFn: (updatedUser: any) =>
        this.userService.updateUser(user._id, updatedUser).pipe(
          tap(() => {
            if (this.authService.getCurrentUser()?._id === user._id) {
              this.authService.updateCurrentUser(updatedUser);
            }
          }),
        ),
    });
  };
}
