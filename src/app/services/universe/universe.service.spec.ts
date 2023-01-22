import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NamedUniverse } from './universe-configuration';
import { IUniverseConfigurationService, UniverseConfigurationService } from './universe-configuration.service';
import { ConfigurableUniverse, ConfigurableUniverseEntry, ConfigurableUniverseEntryPeriod, UniverseService, UniverseServiceErrorNoUniverseFound } from "./universe.service";

describe("ConfigurableUniverseEntryPeriod", () =>{
  let DAY_00 = new Date(2021, 7 - 1,  1);
  let DAY_15 = new Date(2021, 7 - 1, 15);
  let DAY_30 = new Date(2021, 8 - 1,  1);
  let DAY_45 = new Date(2021, 8 - 1, 15);
  let DAY_60 = new Date(2021, 9 - 1,  1);
  let DAY_75 = new Date(2021, 9 - 1, 15);

  it("Can contain all instants when no period defined", () =>{
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({});

    expect(universeEntryPeriod.contains(DAY_00)).withContext("DAY_00").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_15)).withContext("DAY_15").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_30)).withContext("DAY_30").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_45)).withContext("DAY_45").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60)).withContext("DAY_60").toBeTrue();
  });

  it("Can intersect with any interval when no period is defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({});
    expect(universeEntryPeriod.intersects(DAY_00, DAY_75)).toBeTrue();
  });

  it("Can contain instants when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({to: DAY_60});

    expect(universeEntryPeriod.contains(DAY_00)).withContext("DAY_00").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60)).withContext("DAY_60").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_75)).withContext("DAY_75").toBeFalse();
  });

  it("Can intersect with intervals when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({to: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00, DAY_75)).withContext("DAY_00-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_45)).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_30)).withContext("DAY_00-DAY_30").toBeTrue();

    expect(universeEntryPeriod.intersects(DAY_30, DAY_75)).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45, DAY_75)).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60, DAY_75)).withContext("DAY_60-DAY_75").toBeFalse();
  });

  it("Can contain instants when to is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_60});

    expect(universeEntryPeriod.contains(DAY_00)).withContext("DAY_00").toBeFalse();
    expect(universeEntryPeriod.contains(DAY_60)).withContext("DAY_60").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_75)).withContext("DAY_75").toBeTrue();
  });

  it("Can intersect with intervals when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00, DAY_75)).withContext("DAY_00-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_45)).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_30)).withContext("DAY_00-DAY_30").toBeFalse();

    expect(universeEntryPeriod.intersects(DAY_30, DAY_75)).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45, DAY_75)).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60, DAY_75)).withContext("DAY_60-DAY_75").toBeTrue();
  });

  it("Can contain instants when from and to are both defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_15, to: DAY_45});

    expect(universeEntryPeriod.contains(DAY_00)).withContext("DAY_00").toBeFalse();
    expect(universeEntryPeriod.contains(DAY_15)).withContext("DAY_15").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_30)).withContext("DAY_30").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_45)).withContext("DAY_45").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60)).withContext("DAY_60").toBeFalse();
  });

  it("Can intersect with intervals when from and to are both defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_30, to: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00, DAY_15)).withContext("DAY_00-DAY_15").toBeFalse();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_30)).withContext("DAY_00-DAY_30").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_45)).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00, DAY_60)).withContext("DAY_00-DAY_60").toBeTrue();

    expect(universeEntryPeriod.intersects(DAY_15, DAY_75)).withContext("DAY_15-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_30, DAY_75)).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45, DAY_75)).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60, DAY_75)).withContext("DAY_60-DAY_75").toBeFalse();
  });
});

describe("ConfigurableUniverseEntry", () => {
  let DAY_2000 = new Date(2000, 1 - 1, 1);
  let DAY_2005 = new Date(2005, 1 - 1, 1);
  let DAY_2010 = new Date(2010, 1 - 1, 1);
  let DAY_2015 = new Date(2015, 1 - 1, 1);
  let DAY_2020 = new Date(2020, 1 - 1, 1);

  it("Can detect when it belongs to universe", () => {
    let universeEntry = new ConfigurableUniverseEntry({
      name: "A",
      periods: [{from: DAY_2000, to: DAY_2005}, {from: DAY_2015, to: DAY_2020}]
    });
    expect(universeEntry.belongsToUniverse(DAY_2000)).withContext("DAY_2000").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2005)).withContext("DAY_2005").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2010)).withContext("DAY_2010").toBeFalse();
    expect(universeEntry.belongsToUniverse(DAY_2015)).withContext("DAY_2015").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2020)).withContext("DAY_2020").toBeTrue();
  });

  it("Can detect when it belongs to universe with missing from and to", () => {
    let universeEntry = new ConfigurableUniverseEntry({
      name: "A",
      periods: [{to: DAY_2005}, {from: DAY_2015}]
    });
    expect(universeEntry.belongsToUniverse(DAY_2000)).withContext("DAY_2000").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2005)).withContext("DAY_2005").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2010)).withContext("DAY_2010").toBeFalse();
    expect(universeEntry.belongsToUniverse(DAY_2015)).withContext("DAY_2015").toBeTrue();
    expect(universeEntry.belongsToUniverse(DAY_2020)).withContext("DAY_2020").toBeTrue();
  });

  it("Can detect when it is worth assessing", () => {
    let universeEntry = new ConfigurableUniverseEntry({
      name: "A",
      periods: [{from: DAY_2010, to: DAY_2015}]
    });
    let DAYS_BEFORE_40 = new Date(DAY_2010.getFullYear(), DAY_2010.getMonth(), DAY_2010.getDate() - 40);
    let DAYS_BEFORE_20 = new Date(DAY_2010.getFullYear(), DAY_2010.getMonth(), DAY_2010.getDate() - 20);
    let DAYS_BEFORE_10 = new Date(DAY_2010.getFullYear(), DAY_2010.getMonth(), DAY_2010.getDate() - 10);
    let DAY_AFTER      = new Date(DAY_2015.getFullYear(), DAY_2015.getMonth(), DAY_2015.getDate() + 1);

    expect(universeEntry.worthAssessing(DAYS_BEFORE_40, 20)).withContext("DAYS_BEFORE_40").toBeFalse();
    expect(universeEntry.worthAssessing(DAYS_BEFORE_20, 20)).withContext("DAYS_BEFORE_20").toBeTrue();
    expect(universeEntry.worthAssessing(DAYS_BEFORE_10, 20)).withContext("DAYS_BEFORE_10").toBeTrue();
    expect(universeEntry.worthAssessing(DAY_2015, 20))      .withContext("DAY_2015")      .toBeTrue();
    expect(universeEntry.worthAssessing(DAY_AFTER, 20))     .withContext("DAY_AFTER")     .toBeFalse();
  });
});

describe("ConfigurableUniverse", () => {
  let DAY_2000 = new Date(2000, 1 - 1, 1);
  let DAY_2005 = new Date(2005, 1 - 1, 1);
  let DAY_2010 = new Date(2010, 1 - 1, 1);
  let DAY_2015 = new Date(2015, 1 - 1, 1);
  let DAY_2020 = new Date(2020, 1 - 1, 1);
  it("Can do something nice", () => {
    let universe = new ConfigurableUniverse({
      name: "UNIVERSE",
      entries: [
        {
          name: "A",
          periods:[{from: DAY_2000, to: DAY_2010}]
        },
        {
          name: "B",
          periods:[{from: DAY_2005, to: DAY_2015}],
        },
        {
          name: "C",
          periods:[{from: DAY_2010, to: DAY_2020}]
        }
      ]
    });
    expect(universe.allQuotes()).withContext("All Quotes").toEqual(["A", "B", "C"]);

    expect(universe.isRelatedToUniverse("B")).withContext("B is related to universe").toBeTrue();
    expect(universe.isRelatedToUniverse("D")).withContext("D is related to universe").toBeFalse();

    expect(universe.belongsToUniverse("B", DAY_2000)).withContext("B belongs to universe in DAY_2000").toBeFalse();
    expect(universe.belongsToUniverse("B", DAY_2005)).withContext("B belongs to universe in DAY_2005").toBeTrue();
    expect(universe.belongsToUniverse("B", DAY_2015)).withContext("B belongs to universe in DAY_2015").toBeTrue();
    expect(universe.belongsToUniverse("B", DAY_2020)).withContext("B belongs to universe in DAY_2020").toBeFalse();

    expect(universe.belongsToUniverse("D", DAY_2020)).withContext("D belongs to universe in DAY_2020").toBeFalse();

    let DAYS_BEFORE_40 = new Date(DAY_2005.getFullYear(), DAY_2005.getMonth(), DAY_2005.getDate() - 40);
    let DAYS_BEFORE_20 = new Date(DAY_2005.getFullYear(), DAY_2005.getMonth(), DAY_2005.getDate() - 20);
    let DAYS_AFTER_1   = new Date(DAY_2015.getFullYear(), DAY_2015.getMonth(), DAY_2015.getDate() + 1);

    expect(universe.worthAssessing("B", DAYS_BEFORE_40, 20)).withContext("B is worth assessing DAYS_BEFORE_40").toBeFalse();
    expect(universe.worthAssessing("B", DAYS_BEFORE_20, 20)).withContext("B is worth assessing DAYS_BEFORE_20").toBeTrue();
    expect(universe.worthAssessing("B", DAYS_AFTER_1, 20))  .withContext("B is worth assessing DAYS_AFTER_1").toBeFalse();

    expect(universe.worthAssessing("D", DAYS_BEFORE_20, 20)).withContext("D is worth assessing DAYS_BEFORE_40").toBeFalse();
  });
});

class UniverseConfigurationServiceMock implements IUniverseConfigurationService {
  private namedUniverses = new Map<string, NamedUniverse>();

  public add(namedUniverse: NamedUniverse): void {
    this.namedUniverses.set(namedUniverse.name, namedUniverse);
  }

  obtainNamedUniverse(name: string): NamedUniverse {
    return this.namedUniverses.get(name);
  }
};

describe('UniverseService', () => {
  let configurationService: UniverseConfigurationServiceMock;

  let universeService: UniverseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers: [
        {provide: UniverseConfigurationService, useClass: UniverseConfigurationServiceMock}
      ]
    });
    configurationService = TestBed.inject(UniverseConfigurationService) as unknown as UniverseConfigurationServiceMock;

    universeService = TestBed.inject(UniverseService);
  });

  it('Can retrieve an universe', () => {
    configurationService.add({
      name: "X1",
      entries: [
        {
          name: "A",
          longName: "Agilent Technologies",
          gicsSector: "Health Care",
          gicsSubIndustry: "Health Care Equipment",
          founded: 1999,
          periods: [{from: new Date(2000, 6 - 1, 5)}]
        }
      ]
    });

    let universe = universeService.getUniverse("X1");
    expect(universe).toBeTruthy();
    expect(universe.belongsToUniverse("A", new Date(2000, 6 - 1, 4))).toBeFalse();
    expect(universe.belongsToUniverse("A", new Date(2000, 6 - 1, 5))).toBeTrue();
  });

  it("Can throw an error when the requested universe is not configured", () => {
    expect(() => {
      universeService.getUniverse("XXX")
    }).toThrow(new UniverseServiceErrorNoUniverseFound("XXX"));
  });
});
