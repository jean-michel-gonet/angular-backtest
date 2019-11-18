import { TestBed } from '@angular/core/testing';

import { StockServiceService } from './stock-service.service';

describe('StockServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockServiceService = TestBed.get(StockServiceService);
    expect(service).toBeTruthy();
  });
});
