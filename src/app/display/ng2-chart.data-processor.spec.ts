import { Ng2ChartDataProcessor, ShowDataAs, ShowDataOn } from "./ng2-chart.data-processor";
import { ProvidedData } from '../model/core/data-processor';
import { ChartDataSets } from 'chart.js';

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

  let today = new Date(2015, 8, 18);
  let tomorrow = new Date(2015, 8, 19);

  it('Can process to data the same set', () => {
    let ng2ChartDataProcessor: Ng2ChartDataProcessor = new Ng2ChartDataProcessor([{
      show: "SQA01.NAV",
      as: ShowDataAs.LINE,
      on: ShowDataOn.LEFT
    }]);

    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.NAV",
      time: today,
      y: 100
    }));
    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.NAV",
      time: tomorrow,
      y: 101
    }));

    expect(ng2ChartDataProcessor.dataSets).toEqual(jasmine.arrayWithExactContents([{
      data: [100, 101],
      label: "SQA01.NAV",
      yAxisID: "y-axis-left",
      type: "line"
    }]));
    expect(ng2ChartDataProcessor.labels).toEqual([
      today.toDateString(),
      tomorrow.toDateString()
    ]);
  });

  it('Can process four data of two different sets', () => {
    let ng2ChartDataProcessor: Ng2ChartDataProcessor = new Ng2ChartDataProcessor([
      {
        show: "SQA01.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT
      }, {
        show: "SQA01.COSTS",
        as: ShowDataAs.BAR,
        on: ShowDataOn.RIGHT
      }]);

    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.NAV",
      time: today,
      y: 100
    }));
    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.COSTS",
      time: today,
      y: 1
    }));
    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.NAV",
      time: tomorrow,
      y: 101
    }));
    ng2ChartDataProcessor.receiveData(new ProvidedData({
      sourceName: "SQA01.COSTS",
      time: tomorrow,
      y: 2
    }));

    expect(ng2ChartDataProcessor.dataSets).toEqual(jasmine.arrayWithExactContents([
      {
        data: [100, 101],
        label: "SQA01.NAV",
        yAxisID: "y-axis-left",
        type: "line"
      }, {
        data: [1, 2],
        label: "SQA01.COSTS",
        yAxisID: "y-axis-right",
        type: "bar"
      }
    ]));
    expect(ng2ChartDataProcessor.labels).toEqual([
      today.toDateString(),
      tomorrow.toDateString()
    ]);
  });
});
