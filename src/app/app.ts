import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { LoaderComponent } from './loader/loader';
import { ModalComponent } from './modal/modal';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Navbar, LoaderComponent, ModalComponent, CommonModule],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Volunteering-Map-3');

  hideNavbar = false;

  private hiddenRoutes = ['/', '/landing-page', '/404'];

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.hideNavbar = this.hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }
}