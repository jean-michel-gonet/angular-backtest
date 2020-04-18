import { Injectable } from '@angular/core';

@Injectable()
export class StringUtils {

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

  public static convertToDate(s: string) {
    if (s) {
      let tokens = s.split(new RegExp("[.-]"));
      if (tokens.length == 3) {
        let year = parseInt(tokens[0]);
        let month = parseInt(tokens[1]) - 1;
        let day = parseInt(tokens[2]);
        return new Date(year, month, day);
      }
    }
    return undefined;
  }
}
