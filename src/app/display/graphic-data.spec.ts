import { Ng2ChartDataProcessor, ShowDataAs, ShowDataOn } from './graphic-data';

describe('GraphicData', () => {
  it('should create an instance', () => {
    expect(new Ng2ChartDataProcessor([
          {
            show: "SQA01.NAV",
            as: ShowDataAs.LINE,
            on: ShowDataOn.LEFT
          },
          {
            show: "LU1290894820.CLOSE",
            as: ShowDataAs.LINE,
            on: ShowDataOn.LEFT
          },
          {
            show: "SQA01.COSTS",
            as: ShowDataAs.BAR,
            on: ShowDataOn.RIGHT
          },
          {
            show: "BAH01.OUTPUT",
            as: ShowDataAs.BAR,
            on: ShowDataOn.RIGHT
          }
        ])).toBeTruthy();
  });
});
