import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { Store } from '@ngrx/store';

import { LoaderComponent } from '../loader/loader';
import { PaginationComponent } from '../pagination/pagination';
import { Place } from '../../models/place.model';

import { loadPlaces, updateFilters } from '../../store/places/places.actions';
import { selectFilteredPlaces, selectLoading } from '../../store/places/places.selectors';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.html',
  styleUrls: ['./list-places.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    LoaderComponent,
    DatePipe,
    PaginationComponent,
  ],
})
export class ListPlaces implements OnInit {
  places$!: Observable<Place[]>;
  loading$!: Observable<boolean>;

  currentPage = 1;
  itemsPerPage = 4;

  filterForm: FormGroup;
  private store = inject(Store);

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      district: [''],
      category: [''],
      searchName: [''],
      sort: ['newest'],
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadPlaces());

    this.places$ = this.store.select(selectFilteredPlaces);
    this.loading$ = this.store.select(selectLoading);

    this.filterForm.valueChanges.subscribe((values) => {
      this.currentPage = 1;

      this.store.dispatch(
        updateFilters({
          district: values.district,
          category: values.category,
          search: values.searchName,
          sort: values.sort,
        }),
      );
    });
  }

  paginate(places: Place[]): Place[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return places.slice(start, start + this.itemsPerPage);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  getTotalPages(places: Place[]): number {
    return Math.ceil(places.length / this.itemsPerPage);
  }
}
