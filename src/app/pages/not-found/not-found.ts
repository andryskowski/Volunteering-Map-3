import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="not-found">
      <h1 class="paragraph-404">404</h1>
      <p>Page not found</p>
    </div>
    <img class="left-img" src="assets/image5.png" alt="image left" width="733" height="970" />
    <img
      class="right-img"
      src="assets/group_image.svg"
      alt="image right"
      width="887"
      height="1024"
    />
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        position: relative;
        background-color: #f2f7ff;
      }

      .not-found {
        text-align: center;
        z-index: 2;
      }

      .left-img {
        position: absolute;
        left: 0;
        bottom: 0;
      }

      .right-img {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    `,
  ],
})
export class NotFoundComponent {}
