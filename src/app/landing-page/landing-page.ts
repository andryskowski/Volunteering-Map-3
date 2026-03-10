import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [Auth, CommonModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  showAuth = false;

  openAuth() {
    this.showAuth = true;
  }

}
