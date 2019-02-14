import { TestBed } from '@angular/core/testing';

import { StageStateService } from './stage-state.service';

describe('StageStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StageStateService = TestBed.get(StageStateService);
    expect(service).toBeTruthy();
  });
});
