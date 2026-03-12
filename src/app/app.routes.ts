import { Routes } from '@angular/router';
import { Contact } from './contact/contact';
import { MainPage } from './main-page/main-page';
import { ListPlaces } from './list-places/list-places';
import { PlacePage } from './place-page/place-page';
import { PlaceForm } from './place-form/place-form';
import { UsersPanel } from './users-panel/users-panel';
import { Auth } from './auth/auth';
import { UserInfoComponent } from './user-info/user-info';
import { CommentsPanel } from './comments-panel/comments-panel';
import { LandingPage } from './landing-page/landing-page';
import { PlacesPanel } from './places-panel/places-panel';
import { NotFoundComponent } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', component: LandingPage },

  { path: 'contact', component: Contact },
  { path: 'listplaces', component: ListPlaces },
  { path: 'place/:id', component: PlacePage },
  { path: 'place-form', component: PlaceForm },
  { path: 'users-panel', component: UsersPanel },
  { path: 'auth', component: Auth },
  { path: 'user-info/:id', component: UserInfoComponent },
  { path: 'comments-panel', component: CommentsPanel },
  { path: 'places-panel', component: PlacesPanel },
  { path: 'map', component: MainPage },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];
