import { TestBed } from '@angular/core/testing';

import { ButterCMSConfiguredGuard } from './config.guard';

describe('ConfigGuard', () => {
  let guard: ButterCMSConfiguredGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ButterCMSConfiguredGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
