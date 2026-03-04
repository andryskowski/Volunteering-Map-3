import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-places',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-places.html',
  styleUrls: ['./list-places.scss']
})
export class ListPlaces {}