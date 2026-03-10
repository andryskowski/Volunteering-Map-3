import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesPanel } from './places-panel';

describe('PlacesPanel', () => {
  let component: PlacesPanel;
  let fixture: ComponentFixture<PlacesPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlacesPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
