import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlaces } from './list-places';

describe('ListPlaces', () => {
  let component: ListPlaces;
  let fixture: ComponentFixture<ListPlaces>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPlaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlaces);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
