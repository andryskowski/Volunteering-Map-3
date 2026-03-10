import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsPanel } from './comments-panel';

describe('CommentsPanel', () => {
  let component: CommentsPanel;
  let fixture: ComponentFixture<CommentsPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommentsPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
