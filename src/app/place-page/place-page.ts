import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PlaceService } from '../place-service';
import { Place } from '../../models/place.model';
import { CommentsComponent } from "../comment/comment";
import { CommentFormComponent } from "../comment-form/comment-form";

@Component({
  selector: 'app-place-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DatePipe, CommentsComponent, CommentFormComponent],
  templateUrl: './place-page.html',
  styleUrls: ['./place-page.scss']
})
export class PlacePage {
  place$!: Observable<Place | undefined>;

  constructor(
    private route: ActivatedRoute,
    private placeService: PlaceService
  ) {
    this.place$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.placeService.getPlaceById(Number(id));
      })
    );
  }
}