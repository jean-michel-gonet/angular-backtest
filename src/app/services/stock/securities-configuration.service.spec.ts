import { TestBed } from '@angular/core/testing';

import { SecuritiesConfigurationService } from './securities-configuration.service';

describe('SecuritiesConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecuritiesConfigurationService = TestBed.get(SecuritiesConfigurationService);
    expect(service).toBeTruthy();
  });
});
