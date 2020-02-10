import { TestBed } from '@angular/core/testing';

import { QuotesConfigurationService } from './quotes-configuration.service';

describe('QuotesConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuotesConfigurationService = TestBed.get(QuotesConfigurationService);
    expect(service).toBeTruthy();
  });
});
