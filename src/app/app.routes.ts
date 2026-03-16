import { Routes } from '@angular/router';
import { Contact } from './components/contact/contact';
import { MainPage } from './components/main-page/main-page';
import { ListPlaces } from './components/list-places/list-places';
import { PlacePage } from './components/place-page/place-page';
import { PlaceForm } from './components/place-form/place-form';
import { UsersPanel } from './components/users-panel/users-panel';
import { Auth } from './components/auth/auth';
import { UserInfoComponent } from './components/user-info/user-info';
import { CommentsPanel } from './components/comments-panel/comments-panel';
import { LandingPage } from './components/landing-page/landing-page';
import { PlacesPanel } from './components/places-panel/places-panel';
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
