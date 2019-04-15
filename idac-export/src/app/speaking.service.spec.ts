import { TestBed } from '@angular/core/testing';

import { SpeakingService } from './speaking.service';

describe('SpeakingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeakingService = TestBed.get(SpeakingService);
    expect(service).toBeTruthy();
  });
});
