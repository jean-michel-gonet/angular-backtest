import { StringUtils } from './string-utils';

describe('StringUtils', () => {
  it("Can convert to quote of interest", () => {
    let quoteOfInterest1: string = StringUtils.quoteOfInterestFor("USDCHF.CLOSE");
    expect(quoteOfInterest1).toBe("USDCHF");

    let quoteOfInterest2: string = StringUtils.quoteOfInterestFor("USDCHF");
    expect(quoteOfInterest2).toBe("USDCHF");
  });
  it("Can convert to array", () => {
    let s = StringUtils.convertToArray("A, AA. AAA");
    expect(s[0]).toBe("A");
    expect(s[1]).toBe("AA");
    expect(s[2]).toBe("AAA");
  });

  it("Can convert to array an empty string", () => {
    let s = StringUtils.convertToArray("");
    expect(s).toHaveSize(0);
  });

  it("Can convert to array a null", () => {
    let s = StringUtils.convertToArray(null);
    expect(s).toHaveSize(0);
  });

  it("Can convert a string to a date", () => {
    let s = StringUtils.convertToDate("2001-10.25");
    expect(s.getDate()).withContext("Day").toBe(25);
    expect(s.getMonth()).withContext("Month").toBe(9);
    expect(s.getFullYear()).withContext("Year").toBe(2001);
  });

  it("Can convert a null string to a undefined date", () => {
    let s = StringUtils.convertToDate(null);
    expect(s).toBeFalsy();
  });

  it("Can format a Date as Date, returning an empty", () => {
    let s = StringUtils.formatAsDate(new Date(2001, 11 - 1, 25), "-");
    expect(s).toBe("2001-11-25");
  });

  it("Can format a number as Date, returning an empty", () => {
    let s = StringUtils.formatAsDate(new Date(2001, 11 - 1, 25).getTime(), "-");
    expect(s).toBe("2001-11-25");
  });

  it("Can format a null as Date, returning an empty", () => {
    let s = StringUtils.formatAsDate(null);
    expect(s).toBe("");
  });

  it("Can format a string as Date", () => {
    let s = StringUtils.formatAsDate("hello");
    expect(s).toBe("hello");
  });
});
