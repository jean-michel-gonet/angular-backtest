import { Ng2ChartReport, ShowDataAs, ShowDataOn } from "./ng2-chart.data-processor";
import { ReportedData } from '../model/core/reporting';

describe('Ng2ChartReport', () => {
  it('should create an instance', () => {
    expect(new Ng2ChartReport([
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
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport([{
      show: "SQA01.NAV",
      as: ShowDataAs.LINE,
      on: ShowDataOn.LEFT
    }]);

    ng2ChartReport.startReportingCycle(today);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 100
    }));
    ng2ChartReport.startReportingCycle(tomorrow);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 101
    }));

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([{
      data: [100, 101],
      label: "SQA01.NAV",
      yAxisID: "y-axis-left",
      type: "line"
    }]));
    expect(ng2ChartReport.labels).toEqual([
      today.toDateString(),
      tomorrow.toDateString()
    ]);
  });

  it('Can process four data of two different sets', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport([
      {
        show: "SQA01.NAV",
        as: ShowDataAs.LINE,
        on: ShowDataOn.LEFT
      }, {
        show: "SQA01.COSTS",
        as: ShowDataAs.BAR,
        on: ShowDataOn.RIGHT
      }
    ]);

    ng2ChartReport.startReportingCycle(today);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 100
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.COSTS",
      y: 1
    }));
    ng2ChartReport.startReportingCycle(tomorrow);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 101
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.COSTS",
      y: 2
    }));

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([
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
    expect(ng2ChartReport.labels).toEqual([
      today.toDateString(),
      tomorrow.toDateString()
    ]);
  });
});
