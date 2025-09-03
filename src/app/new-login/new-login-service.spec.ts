import { TestBed } from '@angular/core/testing';

import { NewLoginService } from './new-login-service';

describe('NewLoginService', () => {
  let service: NewLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
