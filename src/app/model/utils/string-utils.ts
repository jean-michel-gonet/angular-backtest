import { Injectable } from '@angular/core';

@Injectable()
export class StringUtils {

  /**
   * Extracts the quote of interest based on the source name.
   * Examples:
   * <dl>
   *  <di>USDCHF.CLOSE</di><dd>becomes USDCHF</dd>
   *  <di>USDCHF</di><dd>becomes USDCHF</dd>
   * </dl>
   * @param The source name.
   * @returns The quote of interest.
   */
  public static quoteOfInterestFor(sourceName: string): string {
    let c = sourceName.lastIndexOf('.');
    if (c >= 0) {
      return sourceName.substring(0, c);
    } else {
      return sourceName;
    }
  }

  public static convertToArray(s: string): string[] {
    let array: string[] = [];
    if (s) {
      let tokens = s.split(/[,.]/);
      tokens.forEach(element => {
        array.push(element.trim());
      });
    }
    return array;
  }

  /**
   * Converts a string into a date.
   * @param s String is expected to be YYYY.MM.DD
   * Separator can be either dot (.) or a minus (-)
   * @return The date, or undefined if it could not be converted.
   */
  public static convertToDate(s: string) {
    if (s) {
      let tokens = s.split(new RegExp("[/.-]"));
      if (tokens.length == 3) {
        let year = parseInt(tokens[0]);
        let month = parseInt(tokens[1]) - 1;
        let day = parseInt(tokens[2]);
        return new Date(year, month, day);
      }
    }
    return undefined;
  }

  /**
   * Builds a YYYY/MM/DD representation of the provided date.
   * Depending on the provided type:
   * <ul>
   *  <li>When value is a string, then it returns it unchanged.</li>
   *  <li>When value is a number, then it transforms it into a date before formatting.</li>
   *  <li>When value is a date, then it formats it.</li>
   * </ul>
   * @param value Can be a number, a string or a Date.
   * @return {String} A string representing the provided date.
   */
  public static formatAsDate(value: any, separator: string = "."): string {
    if (!value) {
      return "";
    }
    let date: Date;
    if (typeof value == 'string') {
      return value;
    } else if (value instanceof Date){
      date = value;
    } else if (typeof value == 'number') {
      date = new Date(value);
    }

    let sYear: string = "" + date.getFullYear();
    let month: number = date.getMonth() + 1;
    let sMonth: string;
    if (month < 10) {
      sMonth = "0" + month;
    } else {
      sMonth = "" + month;
    }
    let day: number = date.getDate();
    let sDay: string;
    if (day < 10) {
      sDay = "0" + day;
    } else {
      sDay = "" + day;
    }
    let s = sYear + separator + sMonth + separator + sDay
    return s;
  }

}
