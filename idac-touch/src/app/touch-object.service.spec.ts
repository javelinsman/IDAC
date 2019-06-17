import { TestBed } from '@angular/core/testing';

import { TouchObjectService } from './touch-object.service';

describe('TouchObjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TouchObjectService = TestBed.get(TouchObjectService);
    expect(service).toBeTruthy();
  });
});
