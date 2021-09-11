import { TestBed } from '@angular/core/testing';
import { UniverseConfigurationService } from './universe-configuration.service';


describe('UniverseConfigurationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('Can retrieve a universe', () => {
    const service: UniverseConfigurationService = TestBed.get(UniverseConfigurationService);
    expect(service).toBeTruthy();
    let namedUniverse = service.obtainNamedUniverse("SP500_UNIVERSE");
    expect(namedUniverse).toBeTruthy();
    expect(namedUniverse.name).toBe("SP500_UNIVERSE")
  });
});
