import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Place } from '../../models/place.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PlaceService } from '../place-service';

@Component({
  selector: 'app-list-places',
  templateUrl: './list-places.html',
  styleUrls: ['./list-places.scss'],
  imports: [DatePipe, CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule],
})
export class ListPlaces implements OnInit {
  places: Place[] = [];
  filteredPlaces: any = [];
  paginatedPlaces: any = [];

  filterForm: FormGroup;

  currentPage = 1;
  itemsPerPage = 4;
  sortBy: string = '-';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private placeService: PlaceService
  ) {
    this.filterForm = this.fb.group({
      district: [''],
      category: [''],
      searchName: [''],
      sort: ['newest'],
    });
  }

  ngOnInit(): void {
    this.placeService.loadPlaces().subscribe((data) => {
      this.places = data.map((p) => ({
        ...p,
        date: new Date(p.date),
      }));

      this.filterForm.patchValue({ sort: 'newest' }, { emitEvent: false });
      this.applyFilters();

      this.filterForm.valueChanges.subscribe(() => {
        this.currentPage = 1;
        this.applyFilters();
      });
    });
  }

  applyFilters(): void {
    const { district, category, searchName, sort } = this.filterForm.value;

    this.filteredPlaces = this.places.filter((place: any) => {
      let match = true;
      if (district) match = match && place.district === district;
      if (category) match = match && place.category === category;
      if (searchName) {
        const search = searchName.toLowerCase().trim();
        const name = place.name.toLowerCase();
        match = match && name.includes(search);
      }
      return match;
    });

    if (sort === 'newest') {
      this.filteredPlaces.sort((a: any, b: any) => b.date.getTime() - a.date.getTime());
    } else if (sort === 'oldest') {
      this.filteredPlaces.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
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
