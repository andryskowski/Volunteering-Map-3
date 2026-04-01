import { TestBed } from '@angular/core/testing';
import { ModalService, ModalData } from './modal-service';
import { take, skip } from 'rxjs/operators';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should have initial state with visible false', (done) => {
    service.modalState$.pipe(take(1)).subscribe((state) => {
      expect(state.visible).toBeFalse();
      expect(state.title).toBe('');
      done();
    });
  });

  it('should open modal with correct title and content', (done) => {
    service.open('Test Modal', 'Modal content');

    service.modalState$.pipe(take(1)).subscribe((state) => {
      expect(state.visible).toBeTrue();
      expect(state.title).toBe('Test Modal');
      expect(state.content).toBe('Modal content');
      done();
    });
  });

  it('should close modal keeping other data intact', (done) => {
    service.open('Title', 'Content', { sth: 'sth2' });

    service.modalState$.pipe(skip(1), take(1)).subscribe((state) => {
      expect(state.visible).toBeFalse();
      expect(state.title).toBe('Title');
      expect(state.content).toBe('Content');
      expect(state.inputs?.['sth']).toBe('sth2');
      done();
    });

    service.close();
  });
});
