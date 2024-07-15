import { TestBed } from '@angular/core/testing';

import { OpenLayersMapService } from './open-layers-map.service';

describe('OpenLayersMapService', () => {
  let service: OpenLayersMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenLayersMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
