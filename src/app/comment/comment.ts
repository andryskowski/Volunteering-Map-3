import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService, Comment } from '../comment-service';
import { UserService, User } from '../user-service';
import { Observable, map, switchMap } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Comments:</h2>

    <div *ngFor="let c of commentsWithLogin$ | async">
      <div class="comment">
        <a [routerLink]="['/user-info', c.userId]">
          <img
            (error)="onAvatarError($event)"
            [src]="c.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png'"
            class="profilephoto-comment"
          />
        </a>
        <h4>
          {{ c.subject }} ( User: <a [routerLink]="['/user-info', c.userId]">{{ c.userLogin }}</a>
          )
        </h4>
        <p>{{ c.message }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./comment.scss'],
})
export class CommentsComponent implements OnChanges {
  @Input() placeId!: number;

  commentsWithLogin$!: Observable<(Comment & { userLogin: string; avatarUrl?: string })[]>;
  defaultAvatar: string = 'https://cdn-icons-png.flaticon.com/512/8345/8345328.png';

  constructor(
    private commentService: CommentService,
    private userService: UserService,
  ) {}

  loadComments() {
    this.commentsWithLogin$ = this.commentService.getCommentsByPlaceId(this.placeId).pipe(
      switchMap((comments) =>
        this.userService.getUsers().pipe(
          map((users) =>
            comments.map((c) => {
              const user = users.find((u) => u._id === c.userId);
              return {
                ...c,
                userLogin: user?.login || 'Unknown',
                avatarUrl: user?.avatarUrl,
              };
            }),
          ),
        ),
      ),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['placeId'] && this.placeId) {
      this.loadComments();
    }
  }

  refresh() {
    this.loadComments();
  }

  onAvatarError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultAvatar;
  }
}
