import { TestBed } from '@angular/core/testing';

import { ChartSpecService } from './chart-spec.service';

describe('ChartSpecService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartSpecService = TestBed.get(ChartSpecService);
    expect(service).toBeTruthy();
  });
});
