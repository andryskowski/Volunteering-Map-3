import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { MainPage } from './main-page/main-page';
import { ListPlaces } from './list-places/list-places';

export const routes: Routes = [
  { path: '', component: MainPage },
  { path: 'contact', component: Contact },
  { path: 'listplaces', component: ListPlaces },
];
