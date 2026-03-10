import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceService } from '../place-service';
import { Place } from '../../models/place.model';
import { EntityPanelComponent, DeletableEntity } from '../entity-panel/entity-panel';
import { BehaviorSubject, finalize } from 'rxjs';
import { ModalService } from '../modal-service';
import { EditEntityFormComponent } from '../edit-entity-form/edit-entity-form';

@Component({
  selector: 'app-places-panel',
  standalone: true,
  imports: [CommonModule, EntityPanelComponent],
  template: `
    <app-entity-panel
      [title]="'Places'"
      [entities]="placesForPanel"
      [columns]="['name','city','street','category','district']"
      [deleteFn]="deletePlaceFn"
      [editFn]="editPlaceFn"
      [loading$]="loading$"
    >
    </app-entity-panel>
  `
})
export class PlacesPanel implements OnInit {

  places: Place[] = [];
  placesForPanel: DeletableEntity[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private placeService: PlaceService,
              private modalService: ModalService) {}

  ngOnInit() {
    this.fetchPlaces();

    this.modalService.modalState$.subscribe(state => {
      if (!state.visible) {
        this.fetchPlaces();
      }
    });
  }

  fetchPlaces() {
    this.loadingSubject.next(true);
    this.placeService.loadPlaces()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (places) => {
          this.places = places;
          this.placesForPanel = places.map(p => ({ ...p, _id: p._id ?? 0 }));
        },
        error: (err) => {
          console.error(err);
          this.places = [];
          this.placesForPanel = [];
        }
      });
  }

  deletePlaceFn = (id: string | number) => {
    return this.placeService.deletePlace(Number(id)).pipe(
      finalize(() => {
        this.fetchPlaces();
      })
    );
  };

editPlaceFn = (place: Place) => {
  this.modalService.open(
    'Edit Place',
    EditEntityFormComponent,
    {
      entity: place,
      fields: [
        { name: 'name', label: 'Name' },
        { name: 'city', label: 'City' },
        { name: 'street', label: 'Street' },
        { name: 'houseNo', label: 'House No' },
        { name: 'postalCode', label: 'Postal Code' },
        { name: 'category', label: 'Category' },
        { name: 'district', label: 'District' },
        { name: 'shortDescription', label: 'Short Description', type: 'textarea' }
      ],
      submitFn: (updatedPlace: any) => this.placeService.updatePlace(place._id, updatedPlace)
    }
  );
};
}