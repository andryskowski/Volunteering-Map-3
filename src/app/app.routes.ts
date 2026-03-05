import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { MainPage } from './main-page/main-page';
import { ListPlaces } from './list-places/list-places';
import { PlacePage } from './place-page/place-page';

export const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'contact', component: Contact },
  { path: 'listplaces', component: ListPlaces },
  { path: 'place/:id', component: PlacePage },
  { path: '**', redirectTo: '', pathMatch: 'full' }, 
];
