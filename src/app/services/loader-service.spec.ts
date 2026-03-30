import { LoaderService } from './loader-service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    service = new LoaderService();
  });

  it('should have initial loading$ value false', (done) => {
    service.loading$.subscribe((value) => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('should emit true when show() is called', (done) => {
    service.loading$.subscribe((value) => {
      if (value === true) {
        expect(value).toBeTrue();
        done();
      }
    });
    service.show();
  });

  it('should emit false when hide() is called', (done) => {
    service.show();
    service.loading$.subscribe((value) => {
      if (value === false) {
        expect(value).toBeFalse();
        done();
      }
    });
    service.hide();
  });
});
