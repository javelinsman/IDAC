import { TestBed } from '@angular/core/testing';

import { ChartSpecExampleService } from './chart-spec-example.service';

describe('ChartSpecExampleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartSpecExampleService = TestBed.get(ChartSpecExampleService);
    expect(service).toBeTruthy();
  });
});
