import { Ng2ChartReport, ShowDataAs, ShowDataOn } from "./ng2-chart.report";
import { ReportedData, PreProcessor, Report, Reporter } from '../core/reporting';

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

  class PreProcessorMock implements PreProcessor {
    private y: number;
    public instant: Date;
    constructor(public sourceName: string, public output: string, public p:(y:number) => number) {}

    startReportingCycle(instant: Date): void {
      this.instant = instant;
    }

    receiveData(providedData: ReportedData): void {
      if (providedData.sourceName == this.sourceName) {
        this.y = this.p(providedData.y);
      }
    }
    reportTo(report: Report): void {
      if (this.y) {
        report.receiveData(new ReportedData({sourceName: this.output, y: this.y}));
      }
    }
  }

  class ReporterMock implements Reporter {
    private y: number;
    public instant: Date;

    constructor(public sourceName: string) {}

    public setY(y: number): void {
      this.y = y;
    }

    doRegister(report: Report): void {
      report.register(this);
    }
    startReportingCycle(instant: Date): void {
      this.instant = instant;
    }
    reportTo(report: Report): void {
      report.receiveData(new ReportedData({sourceName: this.sourceName, y: this.y}));
    }
  }

  it('Can follow implements the correct workflow with reporters and preprocessors', () => {
    let reporter: ReporterMock = new ReporterMock("SQA01.NAV");
    let preProcessor: PreProcessorMock = new PreProcessorMock("SQA01.NAV", "OUTPUT", y => 2 * y);
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      preProcessors: [
        preProcessor
      ],
      configurations: [
        {
          show: "OUTPUT",
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        }
      ]});

    reporter.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(today);
    reporter.setY(100);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(tomorrow);
    reporter.setY(101);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

    expect(ng2ChartReport.dataSets).toEqual(jasmine.arrayWithExactContents([
      {
        data: [
          {x: today.valueOf(), y: 200, originalValue: 200},
          {x: tomorrow.valueOf(), y: 202, originalValue: 202}],
        label: "OUTPUT",
        yAxisID: "y-axis-left",
        type: "line",
        borderWidth: 1,
        pointRadius: 1.2
      }
    ]));
    expect(ng2ChartReport.labels.length).toBe(0);
  });

  it('Can ignore data outside of start and end limits', () => {
    let reporter: ReporterMock = new ReporterMock("SQA01.NAV");
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      start: today,
      end: tomorrow,
      configurations:[
        {
          show: reporter.sourceName,
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        }
      ]});
    reporter.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(yesterday);
    reporter.setY(100);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(pastTomorrow);
    reporter.setY(101);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

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
    let reporter: ReporterMock = new ReporterMock("SQA01.NAV");
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      start: today,
      end: tomorrow,
      configurations:[
        {
          show: reporter.sourceName,
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        }
      ]});
    reporter.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(today);
    reporter.setY(100);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(tomorrow);
    reporter.setY(101);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

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
    let reporter1: ReporterMock = new ReporterMock("SQA01.NAV");
    let reporter2: ReporterMock = new ReporterMock("SQA01.COSTS");
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: reporter1.sourceName,
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT
        },
        {
          show: reporter2.sourceName,
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.RIGHT
        }
      ]});
    reporter1.doRegister(ng2ChartReport);
    reporter2.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(today);
    reporter1.setY(100);
    reporter2.setY(1);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(tomorrow);
    reporter1.setY(101);
    reporter2.setY(2);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

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

  it('Can normalize outputs', () => {
    let reporter1: ReporterMock = new ReporterMock("VALUE1");
    let reporter2: ReporterMock = new ReporterMock("VALUE2");
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations:[
        {
          show: reporter1.sourceName,
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT,
          normalize: true
        },
        {
          show: reporter2.sourceName,
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.LEFT,
          normalize: true
        }
      ]});
    reporter1.doRegister(ng2ChartReport);
    reporter2.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(today);
    reporter1.setY(1000);
    reporter2.setY(10);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(tomorrow);
    reporter1.setY(1010);
    reporter2.setY(20);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

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
    let reporter1: ReporterMock = new ReporterMock("VALUE1");
    let reporter2: ReporterMock = new ReporterMock("VALUE2");
    let ng2ChartReport: Ng2ChartReport = new Ng2ChartReport({
      configurations: [
        {
          show: reporter1.sourceName,
          as: ShowDataAs.LINE,
          on: ShowDataOn.LEFT,
          normalize: true
        },
        {
          show: reporter2.sourceName,
          as: ShowDataAs.SCATTER,
          on: ShowDataOn.LEFT,
          normalize: true
        }
      ]});
    reporter1.doRegister(ng2ChartReport);
    reporter2.doRegister(ng2ChartReport);

    ng2ChartReport.startReportingCycle(today);
    reporter1.setY(1000);
    reporter2.setY(0);
    ng2ChartReport.collectReports();

    ng2ChartReport.startReportingCycle(tomorrow);
    reporter1.setY(1010);
    reporter2.setY(20);
    ng2ChartReport.collectReports();

    ng2ChartReport.completeReport();

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
