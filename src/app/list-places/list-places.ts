import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { PlaceService } from '../place-service';
import { LoaderComponent } from '../loader/loader';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.html',
  styleUrls: ['./list-places.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, LoaderComponent, DatePipe],
})
export class ListPlaces implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  paginatedPlaces: Place[] = [];

  filterForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 4;

  private loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(private fb: FormBuilder, private placeService: PlaceService) {
    this.filterForm = this.fb.group({
      district: [''],
      category: [''],
      searchName: [''],
      sort: ['newest'],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(() => {
      this.currentPage = 1;
      this.applyFilters();
    });

    this.fetchPlaces();
  }

  fetchPlaces(): void {
    this.loadingSubject.next(true);

    this.placeService.loadPlaces()
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: (data) => {
          this.places = data.map(p => ({ ...p, date: new Date(p.date) }));
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error loading places', err);
          this.places = [];
          this.filteredPlaces = [];
          this.paginatedPlaces = [];
        }
      });
  }

  applyFilters(): void {
    const { district, category, searchName, sort } = this.filterForm.value;

    this.filteredPlaces = this.places.filter(place => {
      let match = true;
      if (district) match = match && place.district === district;
      if (category) match = match && place.category === category;
      if (searchName) {
        const search = searchName.toLowerCase().trim();
        const name = (place.name || '').toLowerCase();
        match = match && name.includes(search);
      }
      return match;
    });

    if (sort === 'newest') {
      this.filteredPlaces.sort((a, b) => b.date.getTime() - a.date.getTime());
    } else if (sort === 'oldest') {
      this.filteredPlaces.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    this.paginate(this.currentPage);
  }

  paginate(pageNumber: number): void {
    this.currentPage = pageNumber;
    const startIndex = (pageNumber - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPlaces = this.filteredPlaces.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPlaces.length / this.itemsPerPage);
  }
}