import { ConfigurableUniverseEntryPeriod } from "./universe.service";

describe("ConfigurableUniverseEntryPeriod", () =>{
  let DAY_00 = new Date(2021, 7 - 1,  1);
  let DAY_15 = new Date(2021, 7 - 1, 15);
  let DAY_30 = new Date(2021, 8 - 1,  1);
  let DAY_45 = new Date(2021, 8 - 1, 15);
  let DAY_60 = new Date(2021, 9 - 1,  1);
  let DAY_75 = new Date(2021, 9 - 1, 15);

  it("Can contain all instants when no period defined", () =>{
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({});

    expect(universeEntryPeriod.contains(DAY_00.getTime())).withContext("DAY_00").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_15.getTime())).withContext("DAY_15").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_30.getTime())).withContext("DAY_30").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_45.getTime())).withContext("DAY_45").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60.getTime())).withContext("DAY_60").toBeTrue();
  });

  it("Can intersect with any interval when no period is defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({});
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_75.getTime())).toBeTrue();
  });

  it("Can contain instants when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({to: DAY_60});

    expect(universeEntryPeriod.contains(DAY_00.getTime())).withContext("DAY_00").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60.getTime())).withContext("DAY_60").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_75.getTime())).withContext("DAY_75").toBeFalse();
  });

  it("Can intersect with intervals when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({to: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_75.getTime())).withContext("DAY_00-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_45.getTime())).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_30.getTime())).withContext("DAY_00-DAY_30").toBeTrue();

    expect(universeEntryPeriod.intersects(DAY_30.getTime(), DAY_75.getTime())).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45.getTime(), DAY_75.getTime())).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60.getTime(), DAY_75.getTime())).withContext("DAY_60-DAY_75").toBeFalse();
  });

  it("Can contain instants when to is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_60});

    expect(universeEntryPeriod.contains(DAY_00.getTime())).withContext("DAY_00").toBeFalse();
    expect(universeEntryPeriod.contains(DAY_60.getTime())).withContext("DAY_60").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_75.getTime())).withContext("DAY_75").toBeTrue();
  });

  it("Can intersect with intervals when from is not defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_75.getTime())).withContext("DAY_00-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_45.getTime())).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_30.getTime())).withContext("DAY_00-DAY_30").toBeFalse();

    expect(universeEntryPeriod.intersects(DAY_30.getTime(), DAY_75.getTime())).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45.getTime(), DAY_75.getTime())).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60.getTime(), DAY_75.getTime())).withContext("DAY_60-DAY_75").toBeTrue();
  });

  it("Can contain instants when from and to are both defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_15, to: DAY_45});

    expect(universeEntryPeriod.contains(DAY_00.getTime())).withContext("DAY_00").toBeFalse();
    expect(universeEntryPeriod.contains(DAY_15.getTime())).withContext("DAY_15").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_30.getTime())).withContext("DAY_30").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_45.getTime())).withContext("DAY_45").toBeTrue();
    expect(universeEntryPeriod.contains(DAY_60.getTime())).withContext("DAY_60").toBeFalse();
  });

  it("Can intersect with intervals when from and to are both defined", () => {
    let universeEntryPeriod = new ConfigurableUniverseEntryPeriod({from: DAY_30, to: DAY_45});

    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_15.getTime())).withContext("DAY_00-DAY_15").toBeFalse();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_30.getTime())).withContext("DAY_00-DAY_30").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_45.getTime())).withContext("DAY_00-DAY_45").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_00.getTime(), DAY_60.getTime())).withContext("DAY_00-DAY_60").toBeTrue();

    expect(universeEntryPeriod.intersects(DAY_15.getTime(), DAY_75.getTime())).withContext("DAY_15-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_30.getTime(), DAY_75.getTime())).withContext("DAY_30-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_45.getTime(), DAY_75.getTime())).withContext("DAY_45-DAY_75").toBeTrue();
    expect(universeEntryPeriod.intersects(DAY_60.getTime(), DAY_75.getTime())).withContext("DAY_60-DAY_75").toBeFalse();
  });
});
