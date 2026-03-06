import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Legend } from './legend';

describe('Legend', () => {
  let component: Legend;
  let fixture: ComponentFixture<Legend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Legend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Legend);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
