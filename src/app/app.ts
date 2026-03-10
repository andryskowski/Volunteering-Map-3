import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { LoaderComponent } from './loader/loader';
import { ModalComponent } from './modal/modal';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, LoaderComponent, ModalComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Volunteering-Map-3');
  hideNavbar = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.hideNavbar = event.url === '/' || event.url === '/landing-page';
      }
    });
  }
}
