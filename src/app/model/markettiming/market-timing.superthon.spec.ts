import { SuperthonMarketTiming } from "./market-timing.superthon";
import { Candlestick, InstantQuotes, Quote } from '../core/quotes'
import { BearBull } from '../core/market-timing';
import { Periodicity } from '../core/period';

describe('SuperthonMarketTiming', () => {
  it('Can create a new instance', () => {
    expect(new SuperthonMarketTiming({
      assetName: "ANY",
      periodicity: Periodicity.MONTHLY,
      periods: 12
    })).toBeTruthy();
  });

  let makeSuperthon = function(start: Date, values:Candlestick[]): SuperthonMarketTiming {
    let superthon: SuperthonMarketTiming = new SuperthonMarketTiming({
      assetName: "ANY",
      periodicity: Periodicity.MONTHLY,
      periods: 12
    });
    for (let n: number = 0; n < values.length; n++){
      let instant =  new Date(start.getFullYear(), start.getMonth() + n, 1);
      superthon.record(new InstantQuotes({
        instant: instant,
        quotes: [
          new Quote({
            name: "ANY",
            open: values[n].open,
            close: values[n].close
          })
        ]}));
    }
    return superthon;
  }

  it('Can detect a BEAR', () => {
    let superthon = makeSuperthon(new Date(2000,  0, 1),
      [
        new Candlestick({open: 13, close: 12.5}),
        new Candlestick({open: 12, close: 11.5}),
        new Candlestick({open: 11, close: 10.5}),
        new Candlestick({open: 10, close:  9.5}),
        new Candlestick({open:  9, close:  8.5}),
        new Candlestick({open:  8, close:  7.5}),
        new Candlestick({open:  7, close:  6.5}),
        new Candlestick({open:  6, close:  5.5}),
        new Candlestick({open:  5, close:  4.5}),
        new Candlestick({open:  4, close:  3.5}),
        new Candlestick({open:  3, close:  2.5}),
        new Candlestick({open:  2, close:  1.5}),
        new Candlestick({open:  1, close:  0.5})
      ]);
    expect(superthon.magnitude()).toBe(-6);
    expect(superthon.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can detect a BULL', () => {
    let superthon = makeSuperthon(new Date(2000, 0, 1),
      [
        new Candlestick({open:  0, close:  0.5}),
        new Candlestick({open:  1, close:  1.5}),
        new Candlestick({open:  2, close:  2.5}),
        new Candlestick({open:  3, close:  3.5}),
        new Candlestick({open:  4, close:  4.5}),
        new Candlestick({open:  5, close:  5.5}),
        new Candlestick({open:  6, close:  6.5}),
        new Candlestick({open:  7, close:  7.5}),
        new Candlestick({open:  8, close:  8.5}),
        new Candlestick({open:  9, close:  9.5}),
        new Candlestick({open: 10, close: 10.5}),
        new Candlestick({open: 11, close: 11.5}),
        new Candlestick({open: 12, close: 12.5})
      ]);
    expect(superthon.magnitude()).toBe(6);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

  it('Can follow a real case <<loscanalesdesuperthon>> Jun 2017', () => {
    let superthon: SuperthonMarketTiming = new SuperthonMarketTiming({
      assetName: "ANY",
      periodicity: Periodicity.MONTHLY,
      periods: 12,
      threshold: 1,
      status: BearBull.BEAR
    });
    superthon.record(new InstantQuotes({instant: new Date(2016,  5, 1), quotes: [new Quote({name: 'ANY', open: 2093.94, close: 2098.86})]}));; // jun.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016,  6, 1), quotes: [new Quote({name: 'ANY', open: 2099.34, close: 2173.60})]}));; // jul.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016,  7, 1), quotes: [new Quote({name: 'ANY', open: 2173.15, close: 2170.95})]}));; // ago.16
    superthon.record(new InstantQuotes({instant: new Date(2016,  8, 1), quotes: [new Quote({name: 'ANY', open: 2171.33, close: 2168.27})]}));; // sept.16
    superthon.record(new InstantQuotes({instant: new Date(2016,  9, 1), quotes: [new Quote({name: 'ANY', open: 2164.33, close: 2126.15})]}));; // oct.16
    superthon.record(new InstantQuotes({instant: new Date(2016, 10, 1), quotes: [new Quote({name: 'ANY', open: 2128.68, close: 2198.81})]}));; // nov.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016, 11, 1), quotes: [new Quote({name: 'ANY', open: 2200.17, close: 2238.83})]}));; // dic.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  0, 1), quotes: [new Quote({name: 'ANY', open: 2251.57, close: 2278.87})]}));; // ene.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  1, 1), quotes: [new Quote({name: 'ANY', open: 2285.59, close: 2363.64})]}));; // feb.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  2, 1), quotes: [new Quote({name: 'ANY', open: 2380.13, close: 2362.72})]}));; // mar.17
    superthon.record(new InstantQuotes({instant: new Date(2017,  3, 1), quotes: [new Quote({name: 'ANY', open: 2362.34, close: 2384.20})]}));; // abr.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  4, 1), quotes: [new Quote({name: 'ANY', open: 2388.50, close: 2411.80})]}));; // may.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  5, 1), quotes: [new Quote({name: 'ANY', open:    0.00, close:    0.00})]}));; // jun.17

    expect(superthon.magnitude()).toBe(2);
    expect(superthon.bearBull()).toBe(BearBull.BULL);
  });

  it('Can use a threshold value different that 1', () => {
    let superthon: SuperthonMarketTiming = new SuperthonMarketTiming({
      assetName: "ANY",
      periodicity: Periodicity.MONTHLY,
      periods: 12,
      threshold: 4,
      status: BearBull.BEAR
    });
    superthon.record(new InstantQuotes({instant: new Date(2016,  5, 1), quotes: [new Quote({name: 'ANY', open: 2093.94, close: 2098.86})]}));; // jun.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016,  6, 1), quotes: [new Quote({name: 'ANY', open: 2099.34, close: 2173.60})]}));; // jul.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016,  7, 1), quotes: [new Quote({name: 'ANY', open: 2173.15, close: 2170.95})]}));; // ago.16
    superthon.record(new InstantQuotes({instant: new Date(2016,  8, 1), quotes: [new Quote({name: 'ANY', open: 2171.33, close: 2168.27})]}));; // sept.16
    superthon.record(new InstantQuotes({instant: new Date(2016,  9, 1), quotes: [new Quote({name: 'ANY', open: 2164.33, close: 2126.15})]}));; // oct.16
    superthon.record(new InstantQuotes({instant: new Date(2016, 10, 1), quotes: [new Quote({name: 'ANY', open: 2128.68, close: 2198.81})]}));; // nov.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2016, 11, 1), quotes: [new Quote({name: 'ANY', open: 2200.17, close: 2238.83})]}));; // dic.16   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  0, 1), quotes: [new Quote({name: 'ANY', open: 2251.57, close: 2278.87})]}));; // ene.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  1, 1), quotes: [new Quote({name: 'ANY', open: 2285.59, close: 2363.64})]}));; // feb.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  2, 1), quotes: [new Quote({name: 'ANY', open: 2380.13, close: 2362.72})]}));; // mar.17
    superthon.record(new InstantQuotes({instant: new Date(2017,  3, 1), quotes: [new Quote({name: 'ANY', open: 2362.34, close: 2384.20})]}));; // abr.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  4, 1), quotes: [new Quote({name: 'ANY', open: 2388.50, close: 2411.80})]}));; // may.17   +1
    superthon.record(new InstantQuotes({instant: new Date(2017,  5, 1), quotes: [new Quote({name: 'ANY', open:    0.00, close:    0.00})]}));; // jun.17

    expect(superthon.magnitude()).toBe(2);
    expect(superthon.bearBull()).toBe(BearBull.BEAR);
  });

  it('Can follow a real case <<loscanalesdesuperthon>> Sept 2017', () => {
    let superthon = makeSuperthon(new Date(2016, 5, 1), [
      new Candlestick({open: 2093.94, close: 2098.86}), // jun.16   +1
      new Candlestick({open: 2099.34, close: 2173.60}), // jul.16   +1
      new Candlestick({open: 2173.15, close: 2170.95}), // ago.16
      new Candlestick({open: 2171.33, close: 2168.27}), // sept.16
      new Candlestick({open: 2164.33, close: 2126.15}), // oct.16
      new Candlestick({open: 2128.68, close: 2198.81}), // nov.16   +1
      new Candlestick({open: 2200.17, close: 2238.83}), // dic.16   +1
      new Candlestick({open: 2251.57, close: 2278.87}), // ene.17   +1
      new Candlestick({open: 2285.59, close: 2363.64}), // feb.17   +1
      new Candlestick({open: 2380.13, close: 2362.72}), // mar.17
      new Candlestick({open: 2362.34, close: 2384.20}), // abr.17   +1
      new Candlestick({open: 2388.50, close: 2411.80}), // may.17   +1
    ]);

    superthon.record(new InstantQuotes({instant: new Date(2017, 5, 1), quotes: [new Quote({name: 'ANY', open: 2415.65, close: 2423.41})]}));; // jun.17   +1
    expect(superthon.magnitude()).toBe(2);
    superthon.record(new InstantQuotes({instant: new Date(2017, 6, 1), quotes: [new Quote({name: 'ANY', open: 2431.39, close: 2470.30})]}));; // jul.17   +1
    expect(superthon.magnitude()).toBe(2);
    superthon.record(new InstantQuotes({instant: new Date(2017, 7, 1), quotes: [new Quote({name: 'ANY', open: 2477.10, close: 2471.65})]}));; // ago.17
    expect(superthon.magnitude()).toBe(2);
    superthon.record(new InstantQuotes({instant: new Date(2017, 8, 1), quotes: [new Quote({name: 'ANY', open: 2474.42, close: 2519.36})]}));; // sept.17  +1
    expect(superthon.magnitude()).toBe(2);

    superthon.record(new InstantQuotes({instant: new Date(2017, 9, 1), quotes: [new Quote({name: 'ANY', open: 2521.20, close: 2575.26})]}));; // oct.17   +1
    expect(superthon.magnitude()).toBe(3);

    superthon.record(new InstantQuotes({instant: new Date(2017,10, 1), quotes: [new Quote({name: 'ANY', open: 2583.21, close: 2647.58})]}));; // nov.17   +1
    expect(superthon.magnitude()).toBe(4);
    superthon.record(new InstantQuotes({instant: new Date(2017,11, 1), quotes: [new Quote({name: 'ANY', open: 2645.10, close: 2673.61})]}));; // dic.17   +1
    expect(superthon.magnitude()).toBe(4);
    superthon.record(new InstantQuotes({instant: new Date(2018, 0, 1), quotes: [new Quote({name: 'ANY', open: 2683.73, close: 2823.81})]}));; // ene.18   +1
    expect(superthon.magnitude()).toBe(4);
    superthon.record(new InstantQuotes({instant: new Date(2018, 1, 1), quotes: [new Quote({name: 'ANY', open: 2816.45, close: 2713.83})]}));; // feb.18
    expect(superthon.magnitude()).toBe(4);

    superthon.record(new InstantQuotes({instant: new Date(2018, 2, 1), quotes: [new Quote({name: 'ANY', open: 2715.22, close: 2640.87})]}));; // mar.18
    expect(superthon.magnitude()).toBe(3);
    superthon.record(new InstantQuotes({instant: new Date(2018, 3, 1), quotes: [new Quote({name: 'ANY', open: 2633.45, close: 2648.05})]}));; // abr.18   +1
    expect(superthon.magnitude()).toBe(3);
    superthon.record(new InstantQuotes({instant: new Date(2018, 4, 1), quotes: [new Quote({name: 'ANY', open: 2643.64, close: 2705.27})]}));; // may.18   +1
    expect(superthon.magnitude()).toBe(3);
    superthon.record(new InstantQuotes({instant: new Date(2018, 5, 1), quotes: [new Quote({name: 'ANY', open: 2718.70, close: 2718.37})]}));; // jun.18
    expect(superthon.magnitude()).toBe(3);

    superthon.record(new InstantQuotes({instant: new Date(2018, 6, 1), quotes: [new Quote({name: 'ANY', open: 2704.95, close: 2816.29})]}));; // jul.18   +1
    expect(superthon.magnitude()).toBe(2);
  });

  it('Can follow daily updates', () => {
    let superthon: SuperthonMarketTiming = new SuperthonMarketTiming({
      assetName: "ANY",
      periodicity: Periodicity.MONTHLY,
      periods: 12
    });
    // ([0-9]+)-([0-9]+)-([0-9]+)\,([0-9.]+)\,[0-9.]+\,[0-9.]+\,([0-9.]+)\,[0-9.]+\,[0-9.]+
    // superthon.record(new InstantQuotes({instant: new Date($1, $2 - 1, $3), quotes: [new Quote({name: 'ANY', open: $4, close: $5})]}));;
    // Date,Open,High,Low,Close,Adj Close,Volume
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1335.180054, close: 1354.630005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1354.630005, close: 1332.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1332.000000, close: 1347.310059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1347.310059, close: 1332.050049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1332.050049, close: 1345.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1345.000000, close: 1340.300049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1340.300049, close: 1355.609985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1355.609985, close: 1364.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1364.000000, close: 1367.560059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1367.560059, close: 1337.800049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1337.800049, close: 1339.489990})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1339.489990, close: 1333.319946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1333.319946, close: 1344.229980})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1344.229980, close: 1338.829956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1338.829956, close: 1330.290039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1330.290039, close: 1306.650024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1306.650024, close: 1284.400024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1284.400024, close: 1304.760010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1304.760010, close: 1281.410034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  5 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1281.410034, close: 1301.839966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1301.839966, close: 1294.260010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1294.260010, close: 1294.810059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1294.810059, close: 1299.540039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1299.540039, close: 1327.750000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1327.750000, close: 1334.520020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1334.520020, close: 1317.329956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1317.329956, close: 1318.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1318.640015, close: 1302.819946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1302.819946, close: 1293.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1293.640015, close: 1294.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1294.000000, close: 1301.160034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1301.160034, close: 1330.410034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1330.410034, close: 1339.900024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1339.900024, close: 1342.839966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1342.839966, close: 1349.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1349.000000, close: 1335.880005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1335.869995, close: 1333.060059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1333.060059, close: 1315.780029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1315.780029, close: 1315.310059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1315.310059, close: 1331.349976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1331.349976, close: 1351.449951})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  6 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1351.449951, close: 1372.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1372.709961, close: 1380.959961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1380.959961, close: 1391.219971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1391.219971, close: 1388.119995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1388.119995, close: 1395.859985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1395.859985, close: 1394.420044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1394.420044, close: 1403.280029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1403.280029, close: 1399.099976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1399.099976, close: 1393.560059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1393.560059, close: 1398.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1398.170044, close: 1409.619995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1409.619995, close: 1418.780029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1418.780029, close: 1407.650024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1407.650024, close: 1377.099976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1377.099976, close: 1379.290039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1379.290039, close: 1360.969971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1360.969971, close: 1356.939941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1356.939941, close: 1347.760010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1347.750000, close: 1362.839966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1362.839966, close: 1365.400024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1365.400024, close: 1341.030029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  7 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1341.030029, close: 1328.719971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1328.719971, close: 1328.050049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1328.050049, close: 1322.180054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1322.180054, close: 1305.329956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1305.329956, close: 1313.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1313.709961, close: 1300.290039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1300.290039, close: 1297.800049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1297.800049, close: 1281.430054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1281.430054, close: 1301.930054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1301.930054, close: 1298.160034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1298.160034, close: 1327.680054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1327.680054, close: 1330.770020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1330.770020, close: 1344.160034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1344.160034, close: 1332.839966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1332.839966, close: 1323.589966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1323.589966, close: 1336.609985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1336.609985, close: 1360.219971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1360.219971, close: 1363.500000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1363.500000, close: 1381.790039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1381.790039, close: 1362.010010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1362.010010, close: 1348.270020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1348.270020, close: 1324.020020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  8 - 1, 31), quotes: [new Quote({name: 'ANY', open: 1324.020020, close: 1320.410034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1320.410034, close: 1331.069946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1331.069946, close: 1319.109985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1319.109985, close: 1357.239990})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1357.239990, close: 1350.449951})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1350.449951, close: 1344.150024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1344.150024, close: 1347.660034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1347.660034, close: 1351.660034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1351.660034, close: 1344.130005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1344.130005, close: 1336.290039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1336.290039, close: 1317.969971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1317.969971, close: 1318.479980})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1318.479980, close: 1335.420044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1335.420044, close: 1335.530029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1335.520020, close: 1307.579956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1307.579956, close: 1310.510010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1310.510010, close: 1280.410034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1280.410034, close: 1277.359985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1277.359985, close: 1283.310059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1283.310059, close: 1282.199951})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1282.199951, close: 1268.369995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999,  9 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1268.369995, close: 1282.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1282.709961, close: 1282.810059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1282.810059, close: 1304.599976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1304.599976, close: 1301.349976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1301.349976, close: 1325.400024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1325.400024, close: 1317.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1317.640015, close: 1336.020020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1336.020020, close: 1335.209961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1335.209961, close: 1313.040039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1313.040039, close: 1285.550049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1285.550049, close: 1283.420044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1283.420044, close: 1247.410034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1247.410034, close: 1254.130005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1254.130005, close: 1261.319946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1261.319946, close: 1289.430054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1289.430054, close: 1283.609985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1283.609985, close: 1301.650024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1301.650024, close: 1293.630005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1293.630005, close: 1281.910034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1281.910034, close: 1296.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1296.709961, close: 1342.439941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 10 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1342.439941, close: 1362.930054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1362.930054, close: 1354.119995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1354.119995, close: 1347.739990})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1347.739990, close: 1354.930054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1354.930054, close: 1362.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1362.640015, close: 1370.229980})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1370.229980, close: 1377.010010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1377.010010, close: 1365.280029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1365.280029, close: 1373.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1373.459961, close: 1381.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1381.459961, close: 1396.060059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1396.060059, close: 1394.390015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1394.390015, close: 1420.069946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1420.069946, close: 1410.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1410.709961, close: 1424.939941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1424.939941, close: 1422.000000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1422.000000, close: 1420.939941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1420.939941, close: 1404.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1404.640015, close: 1417.079956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1417.079956, close: 1416.619995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1416.619995, close: 1407.829956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 11 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1407.829956, close: 1388.910034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1388.910034, close: 1397.719971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1397.719971, close: 1409.040039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1409.040039, close: 1433.300049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1433.300049, close: 1423.329956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1423.329956, close: 1409.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1409.170044, close: 1403.880005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1403.880005, close: 1408.109985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1408.109985, close: 1417.040039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1417.040039, close: 1415.219971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1415.219971, close: 1403.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1403.170044, close: 1413.329956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1413.319946, close: 1418.780029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1418.780029, close: 1421.030029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1421.030029, close: 1418.089966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1418.089966, close: 1433.430054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1433.430054, close: 1436.130005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1436.130005, close: 1458.339966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1458.339966, close: 1457.099976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1457.089966, close: 1457.660034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1457.660034, close: 1463.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1463.459961, close: 1464.469971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(1999, 12 - 1, 31), quotes: [new Quote({name: 'ANY', open: 1464.469971, close: 1469.250000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1469.250000, close: 1455.219971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1455.219971, close: 1399.420044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1399.420044, close: 1402.109985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1402.109985, close: 1403.449951})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1403.449951, close: 1441.469971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1441.469971, close: 1457.599976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1457.599976, close: 1438.560059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1438.560059, close: 1432.250000})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1432.250000, close: 1449.680054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1449.680054, close: 1465.150024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1465.150024, close: 1455.140015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1455.140015, close: 1455.900024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1455.900024, close: 1445.569946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1445.569946, close: 1441.359985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1441.359985, close: 1401.530029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1401.530029, close: 1410.030029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1410.030029, close: 1404.089966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1404.089966, close: 1398.560059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1398.560059, close: 1360.160034})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  1 - 1, 31), quotes: [new Quote({name: 'ANY', open: 1360.160034, close: 1394.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1394.459961, close: 1409.280029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1409.280029, close: 1409.119995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1409.119995, close: 1424.969971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1424.969971, close: 1424.369995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1424.369995, close: 1424.239990})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1424.239990, close: 1441.719971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1441.719971, close: 1411.709961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1411.699951, close: 1416.829956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1416.829956, close: 1387.119995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1387.119995, close: 1389.939941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1389.939941, close: 1402.050049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1402.050049, close: 1387.670044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1387.670044, close: 1388.260010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1388.260010, close: 1346.089966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1346.089966, close: 1352.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1352.170044, close: 1360.689941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1360.689941, close: 1353.430054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1353.430054, close: 1333.359985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1333.359985, close: 1348.050049})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  2 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1348.050049, close: 1366.420044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1366.420044, close: 1379.189941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  2), quotes: [new Quote({name: 'ANY', open: 1379.189941, close: 1381.760010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1381.760010, close: 1409.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1409.170044, close: 1391.280029})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1391.280029, close: 1355.619995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  8), quotes: [new Quote({name: 'ANY', open: 1355.619995, close: 1366.699951})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1,  9), quotes: [new Quote({name: 'ANY', open: 1366.699951, close: 1401.689941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1401.689941, close: 1395.069946})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1395.069946, close: 1383.619995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1383.619995, close: 1359.150024})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 15), quotes: [new Quote({name: 'ANY', open: 1359.150024, close: 1392.140015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 16), quotes: [new Quote({name: 'ANY', open: 1392.150024, close: 1458.469971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1458.469971, close: 1464.469971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1464.469971, close: 1456.630005})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 21), quotes: [new Quote({name: 'ANY', open: 1456.630005, close: 1493.869995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 22), quotes: [new Quote({name: 'ANY', open: 1493.869995, close: 1500.640015})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 23), quotes: [new Quote({name: 'ANY', open: 1500.640015, close: 1527.349976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1527.349976, close: 1527.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1527.459961, close: 1523.859985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1523.859985, close: 1507.729980})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 29), quotes: [new Quote({name: 'ANY', open: 1507.729980, close: 1508.520020})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 30), quotes: [new Quote({name: 'ANY', open: 1508.520020, close: 1487.920044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  3 - 1, 31), quotes: [new Quote({name: 'ANY', open: 1487.920044, close: 1498.579956})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1,  3), quotes: [new Quote({name: 'ANY', open: 1498.579956, close: 1505.969971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1,  4), quotes: [new Quote({name: 'ANY', open: 1505.979980, close: 1494.729980})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1,  5), quotes: [new Quote({name: 'ANY', open: 1494.729980, close: 1487.369995})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1,  6), quotes: [new Quote({name: 'ANY', open: 1487.369995, close: 1501.339966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1,  7), quotes: [new Quote({name: 'ANY', open: 1501.339966, close: 1516.349976})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 10), quotes: [new Quote({name: 'ANY', open: 1516.349976, close: 1504.459961})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 11), quotes: [new Quote({name: 'ANY', open: 1504.459961, close: 1500.589966})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 12), quotes: [new Quote({name: 'ANY', open: 1500.589966, close: 1467.170044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 13), quotes: [new Quote({name: 'ANY', open: 1467.170044, close: 1440.510010})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 14), quotes: [new Quote({name: 'ANY', open: 1440.510010, close: 1356.560059})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 17), quotes: [new Quote({name: 'ANY', open: 1356.560059, close: 1401.439941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 18), quotes: [new Quote({name: 'ANY', open: 1401.439941, close: 1441.609985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 19), quotes: [new Quote({name: 'ANY', open: 1441.609985, close: 1427.469971})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 20), quotes: [new Quote({name: 'ANY', open: 1427.469971, close: 1434.540039})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 24), quotes: [new Quote({name: 'ANY', open: 1434.540039, close: 1429.859985})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 25), quotes: [new Quote({name: 'ANY', open: 1429.859985, close: 1477.439941})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 26), quotes: [new Quote({name: 'ANY', open: 1477.439941, close: 1460.989990})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 27), quotes: [new Quote({name: 'ANY', open: 1460.989990, close: 1464.920044})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  4 - 1, 28), quotes: [new Quote({name: 'ANY', open: 1464.920044, close: 1452.430054})]}));;
    superthon.record(new InstantQuotes({instant: new Date(2000,  5 - 1,  1), quotes: [new Quote({name: 'ANY', open: 1452.430054, close: 1468.250000})]}));;

    expect(superthon.magnitude()).toBe(-1);
    expect(superthon.bearBull()).toBe(BearBull.BEAR);
  });
});
