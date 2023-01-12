import { TestBed } from '@angular/core/testing';

import { IsSigninGuardService } from './is-signin-guard.service';

describe('IsSigninGuardService', () => {
  let service: IsSigninGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsSigninGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
