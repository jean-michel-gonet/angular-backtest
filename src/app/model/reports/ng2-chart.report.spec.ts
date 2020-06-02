import { Ng2ChartReport, ShowDataAs, ShowDataOn } from "./ng2-chart.report";
import { ReportedData } from '../core/reporting';

describe('Ng2ChartReport', () => {
  let yesterday = new Date(2015, 8, 17);
  let today = new Date(2015, 8, 18);
  let tomorrow = new Date(2015, 8, 19);
  let pastTomorrow = new Date(2015, 8, 20);

  it('should create an instance', () => {
    expect(new Ng2ChartReport({
      configurations: [
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
              as: ShowDataAs.SCATTER,
              on: ShowDataOn.RIGHT
            },
            {
              show: "BAH01.OUTPUT",
              as: ShowDataAs.SCATTER,
              on: ShowDataOn.RIGHT
            }
          ],
      start: today,
      end: tomorrow
    })).toBeTruthy();
  });

  it('Can ignore data outside of start and end limits', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      start: today,
      end: tomorrow,
      configurations:[
        {
          show: "SQA01.NAV",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        }
      ]});

    ng2ChartReport.startReportingCycle(yesterday);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 100
    }));
    ng2ChartReport.startReportingCycle(pastTomorrow);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "SQA01.NAV",
      y: 101
    }));

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([{
      data: [],
      label: "SQA01.NAV",
      yAxisID: "y-axis-left",
      type: "line",
      borderWidth: 1,
      pointRadius: 1.2
    }]));

  });

  it('Can process to data the same set', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      start: today,
      end: tomorrow,
      configurations:[
        {
          show: "SQA01.NAV",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        }
      ]});

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
      data: [
        {x: today.valueOf(), y: 100, originalValue: 100},
        {x: tomorrow.valueOf(), y: 101, originalValue: 101}],
      label: "SQA01.NAV",
      yAxisID: "y-axis-left",
      type: "line",
      borderWidth: 1,
      pointRadius: 1.2
    }]));
    expect(ng2ChartReport.labels.length).toBe(0);
  });

  it('Can process four data of two different sets', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: "SQA01.NAV",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        },
        {
          show: "SQA01.COSTS",
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.RIGHT
        }
      ]});

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
        data: [
          {x: today.valueOf(), y: 100, originalValue: 100},
          {x: tomorrow.valueOf(), y: 101, originalValue: 101}],
        label: "SQA01.NAV",
        yAxisID: "y-axis-left",
        type: "line",
        borderWidth: 1,
        pointRadius: 1.2
      }, {
        data: [
          {x: today.valueOf(), y: 1, originalValue: 1},
          {x: tomorrow.valueOf(), y: 2, originalValue: 2}
        ],
        label: "SQA01.COSTS",
        yAxisID: "y-axis-right",
        type: "scatter",
        borderWidth: 1,
        pointRadius: 1.2
      }
    ]));
    expect(ng2ChartReport.labels.length).toBe(0);
  });

  it('Can call pre-processors and receive data from them', () => {

  });

  it('Can normalize outputs', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations:[
        {
          show: "VALUE1",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT,
          normalize: true
        },
        {
          show: "VALUE2",
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.LEFT,
          normalize: true
        }
      ]});

    ng2ChartReport.startReportingCycle(today);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE1",
      y: 1000
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE2",
      y: 10
    }));
    ng2ChartReport.startReportingCycle(tomorrow);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE1",
      y: 1010
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE2",
      y: 20
    }));

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([
      {
        data: [
          {x: today.valueOf(), y: 100, originalValue: 1000},
          {x: tomorrow.valueOf(), y: 101, originalValue: 1010}
        ],
        label: "VALUE1",
        yAxisID: "y-axis-left",
        type: "line",
        borderWidth: 1,
        pointRadius: 1.2
      }, {
        data: [
          {x: today.valueOf(), y: 100, originalValue: 10},
          {x: tomorrow.valueOf(), y: 200, originalValue: 20}],
        label: "VALUE2",
        yAxisID: "y-axis-left",
        type: "scatter",
        borderWidth: 1,
        pointRadius: 1.2
      }
    ]));
    expect(ng2ChartReport.labels.length).toBe(0);
  });

  it('Can normalize outputs even if one set starts at zero', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: "VALUE1",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT,
          normalize: true
        },
        {
          show: "VALUE2",
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.LEFT,
          normalize: true
        }
      ]});

    ng2ChartReport.startReportingCycle(today);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE1",
      y: 1000
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE2",
      y: 0
    }));
    ng2ChartReport.startReportingCycle(tomorrow);
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE1",
      y: 1010
    }));
    ng2ChartReport.receiveData(new ReportedData({
      sourceName: "VALUE2",
      y: 20
    }));

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([
      {
        data: [
          {x: today.valueOf(), y: 100, originalValue: 1000},
          {x: tomorrow.valueOf(), y: 101, originalValue: 1010}
        ],
        label: "VALUE1",
        yAxisID: "y-axis-left",
        type: "line",
        borderWidth: 1,
        pointRadius: 1.2
      }, {
        data: [
          {x: today.valueOf(), y: 0/0, originalValue: 0},
          {x: tomorrow.valueOf(), y: 100, originalValue: 20}
        ],
        label: "VALUE2",
        yAxisID: "y-axis-left",
        type: "scatter",
        borderWidth: 1,
        pointRadius: 1.2
      }
    ]));
    expect(ng2ChartReport.labels.length).toBe(0);
  });

  it('Can hide the left axis when not used', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: "VALUE1",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        },
        {
          show: "VALUE2",
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.LEFT
        }
      ]});
    expect(ng2ChartReport.options.scales.yAxes).toEqual(jasmine.arrayWithExactContents([
      {
        id: "y-axis-left",
        position: 'left',
        ticks: {
          beginAtZero: true
        }
      }]));
  });

  it('Can hide the right axis when not used', () => {
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: "VALUE1",
          as: ShowDataAs.LINE,
          on: ShowDataOn.RIGHT
        }, {
          show: "VALUE2",
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.RIGHT
        }
      ]});
    expect(ng2ChartReport.options.scales.yAxes).toEqual(jasmine.arrayWithExactContents([
      {
        id: "y-axis-right",
        position: 'right',
        ticks: {
          beginAtZero: true
        }
      }]));
  });
});
