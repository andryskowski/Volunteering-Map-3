import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEntityForm } from './edit-entity-form';

describe('EditEntityForm', () => {
  let component: EditEntityForm;
  let fixture: ComponentFixture<EditEntityForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEntityForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEntityForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
