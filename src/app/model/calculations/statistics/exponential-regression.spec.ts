import { ExponentialRegression } from './exponential-regression';

describe("ExponentialRegression" , () => {
  it("Can calculate the exponential regression 1", () => {
    let exponential: ExponentialRegression = new ExponentialRegression();

    let p: number = 2000;
    let r: number = 2 / 100;

    for(var day: number = 0; day < 500; day++) {
      let year: number = day / 365;
      let c: number = p * ((1 + r) ** year);

      exponential.regression(year, c);
    }

    expect(exponential.getCAGR()).toBeCloseTo(r, 3);
    expect(exponential.getP()).toBeCloseTo(p, 3);
    expect(exponential.getR()).toBeCloseTo(1, 3);
    expect(exponential.getR2()).toBeCloseTo(1, 3);
  });

  it("Can calculate the exponential regression 2", () => {
    let exponential: ExponentialRegression = new ExponentialRegression();

    exponential.regression(new Date(2018,  1 - 1,  1), 2099.00000000000);
    exponential.regression(new Date(2018,  1 - 1, 17), 1997.73687449615);
    exponential.regression(new Date(2018,  2 - 1,  2), 2015.47525735881);
    exponential.regression(new Date(2018,  2 - 1, 15), 2010.88880499162);
    exponential.regression(new Date(2018,  2 - 1, 25), 2042.97682794115);
    exponential.regression(new Date(2018,  3 - 1, 15), 1965.93675740886);
    exponential.regression(new Date(2018,  4 - 1,  1), 1985.78956019036);
    exponential.regression(new Date(2018,  4 - 1, 20), 1994.86236303265);
    exponential.regression(new Date(2018,  5 - 1,  4), 1953.39105926891);
    exponential.regression(new Date(2018,  5 - 1, 15), 1947.59299257059);
    exponential.regression(new Date(2018,  5 - 1, 28), 2020.01438429742);
    exponential.regression(new Date(2018,  6 - 1,  7), 2044.10844493122);
    exponential.regression(new Date(2018,  6 - 1, 17), 2035.20309929525);
    exponential.regression(new Date(2018,  7 - 1,  7), 2008.39419050299);
    exponential.regression(new Date(2018,  7 - 1, 22), 2110.03906984833);
    exponential.regression(new Date(2018,  8 - 1,  4), 2097.46571513887);
    exponential.regression(new Date(2018,  8 - 1, 22), 2086.44273203496);
    exponential.regression(new Date(2018,  9 - 1,  4), 2083.87177877199);
    exponential.regression(new Date(2018,  9 - 1, 18), 1941.41187978314);
    exponential.regression(new Date(2018, 10 - 1,  5), 2035.28357577108);
    exponential.regression(new Date(2018, 10 - 1, 22), 2060.15699884705);
    exponential.regression(new Date(2018, 11 - 1,  7), 2002.92179967879);
    exponential.regression(new Date(2018, 11 - 1, 27), 1986.12995611956);
    exponential.regression(new Date(2018, 12 - 1, 15), 2119.11934654796);
    exponential.regression(new Date(2019,  1 - 1,  4), 2059.33206011583);
    exponential.regression(new Date(2019,  1 - 1, 14), 2123.43931758594);
    exponential.regression(new Date(2019,  1 - 1, 29), 2106.10133056541);
    exponential.regression(new Date(2019,  2 - 1, 15), 1947.98658109145);


    expect(exponential.getCAGR()).toBeCloseTo(0.02166, 2);
    expect(exponential.getP()).toBeCloseTo(2007.0073, 2);
    expect(exponential.getR2()).toBeCloseTo(0.06872, 2);
  });

  it("Can caluclate the exponential regression 3", () => {
    let exponential: ExponentialRegression = new ExponentialRegression();

    exponential.regression(new Date(2006, 10 - 1,  6), 2.650714);
    exponential.regression(new Date(2006, 10 - 1,  9), 2.665357);
    exponential.regression(new Date(2006, 10 - 1, 10), 2.636071);
    exponential.regression(new Date(2006, 10 - 1, 11), 2.615357);
    exponential.regression(new Date(2006, 10 - 1, 12), 2.687857);
    exponential.regression(new Date(2006, 10 - 1, 13), 2.679286);
    exponential.regression(new Date(2006, 10 - 1, 16), 2.692857);
    exponential.regression(new Date(2006, 10 - 1, 17), 2.653214);
    exponential.regression(new Date(2006, 10 - 1, 18), 2.661786);
    exponential.regression(new Date(2006, 10 - 1, 19), 2.821071);
    exponential.regression(new Date(2006, 10 - 1, 20), 2.855357);
    exponential.regression(new Date(2006, 10 - 1, 23), 2.909286);
    exponential.regression(new Date(2006, 10 - 1, 24), 2.894643);
    exponential.regression(new Date(2006, 10 - 1, 25), 2.917143);
    exponential.regression(new Date(2006, 10 - 1, 26), 2.935357);
    exponential.regression(new Date(2006, 10 - 1, 27), 2.871786);
    exponential.regression(new Date(2006, 10 - 1, 30), 2.872143);
    exponential.regression(new Date(2006, 10 - 1, 31), 2.895714);
    exponential.regression(new Date(2006, 11 - 1,  1), 2.827143);
    exponential.regression(new Date(2006, 11 - 1,  2), 2.820714);
    exponential.regression(new Date(2006, 11 - 1,  3), 2.796071);
    exponential.regression(new Date(2006, 11 - 1,  6), 2.846786);
    exponential.regression(new Date(2006, 11 - 1,  7), 2.875357);
    exponential.regression(new Date(2006, 11 - 1,  8), 2.944643);
    exponential.regression(new Date(2006, 11 - 1,  9), 2.976429);
    exponential.regression(new Date(2006, 11 - 1, 10), 2.968571);
    exponential.regression(new Date(2006, 11 - 1, 13), 3.012500);
    exponential.regression(new Date(2006, 11 - 1, 14), 3.035714);
    exponential.regression(new Date(2006, 11 - 1, 15), 3.001786);
    exponential.regression(new Date(2006, 11 - 1, 16), 3.057500);
    exponential.regression(new Date(2006, 11 - 1, 17), 3.066071);
    exponential.regression(new Date(2006, 11 - 1, 20), 3.088214);
    exponential.regression(new Date(2006, 11 - 1, 21), 3.164286);
    exponential.regression(new Date(2006, 11 - 1, 22), 3.225357);
    exponential.regression(new Date(2006, 11 - 1, 24), 3.272500);
    exponential.regression(new Date(2006, 11 - 1, 27), 3.197857);
    exponential.regression(new Date(2006, 11 - 1, 28), 3.278929);
    exponential.regression(new Date(2006, 11 - 1, 29), 3.278571);
    exponential.regression(new Date(2006, 11 - 1, 30), 3.273571);
    exponential.regression(new Date(2006, 12 - 1,  1), 3.261429);
    exponential.regression(new Date(2006, 12 - 1,  4), 3.254286);
    exponential.regression(new Date(2006, 12 - 1,  5), 3.259643);
    exponential.regression(new Date(2006, 12 - 1,  6), 3.208214);
    exponential.regression(new Date(2006, 12 - 1,  7), 3.108571);
    exponential.regression(new Date(2006, 12 - 1,  8), 3.152143);
    exponential.regression(new Date(2006, 12 - 1, 11), 3.169643);
    exponential.regression(new Date(2006, 12 - 1, 12), 3.076429);
    exponential.regression(new Date(2006, 12 - 1, 13), 3.180357);
    exponential.regression(new Date(2006, 12 - 1, 14), 3.162500);
    exponential.regression(new Date(2006, 12 - 1, 15), 3.132857);
    exponential.regression(new Date(2006, 12 - 1, 18), 3.052500);
    exponential.regression(new Date(2006, 12 - 1, 19), 3.082500);
    exponential.regression(new Date(2006, 12 - 1, 20), 3.027143);
    exponential.regression(new Date(2006, 12 - 1, 21), 2.960714);
    exponential.regression(new Date(2006, 12 - 1, 22), 2.935714);
    exponential.regression(new Date(2006, 12 - 1, 26), 2.911071);
    exponential.regression(new Date(2006, 12 - 1, 27), 2.911429);
    exponential.regression(new Date(2006, 12 - 1, 28), 2.888214);
    exponential.regression(new Date(2006, 12 - 1, 29), 3.030000);
    exponential.regression(new Date(2007,  1 - 1,  3), 2.992857);

    expect(exponential.getCAGR()).toBeCloseTo(0.643, 2);
    expect(exponential.getP()).toBeCloseTo(2.755, 2);
    expect(exponential.getR2()).toBeCloseTo(0.4722, 2);
  });

});
