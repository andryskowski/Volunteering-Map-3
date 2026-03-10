import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityPanel } from './entity-panel';

describe('EntityPanel', () => {
  let component: EntityPanel;
  let fixture: ComponentFixture<EntityPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
