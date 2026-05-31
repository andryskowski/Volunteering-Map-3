import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, of } from 'rxjs';
import { PlaceService } from '../../services/place-service';
import { loadPlaces, loadPlacesFailure, loadPlacesSuccess } from './places.actions';
import { ModalService } from '../../services/modal-service';

@Injectable()
export class PlacesEffects {
  private actions$ = inject(Actions);
  private placeService = inject(PlaceService);

  constructor(private modalService: ModalService) {}

  loadPlaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPlaces),

      switchMap(() =>
        this.placeService.loadPlaces().pipe(
          map((places) => loadPlacesSuccess({ places })),
          catchError((error) => {
            const message = error?.message ?? 'Unknown error';

            this.modalService.open('Error loading places', message);

            return of(loadPlacesFailure({ error: message }));
          }),
        ),
      ),
    ),
  );
}
