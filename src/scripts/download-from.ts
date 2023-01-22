import * as https from 'https';
import * as http  from 'http';
import { Observable, Observer } from 'rxjs';

export class DownloadFrom {
  protected downloadFromUrl(url: string): Observable<string> {
    if (url.startsWith("https")) {
      console.info("Retrieving HTTPS from " + url);
      return new Observable<string>(observer => {
        https.get(url, incomingMessage => {
          this.incomingMessage(incomingMessage, observer);
        }).on("error", (e) => {
          observer.error(e);
        });
      });
    } else {
      console.info("Retrieving HTTP from " + url);
      return new Observable<string>(observer => {
        http.get(url, incomingMessage => {
          this.incomingMessage(incomingMessage, observer);
        }).on("error", (e) => {
          observer.error(e);
        });
      });
    }
  }

  protected incomingMessage(incomingMessage: http.IncomingMessage, observer: Observer<string>): void {
    // Check that there are no errors in the incoming message:
    let statusCode: number = incomingMessage.statusCode;
    if (statusCode != 200) {
      observer.error(new Error("Status code: " + statusCode));
      incomingMessage.resume();
      return;
    }
    else {
      // Set the encoding
      incomingMessage.setEncoding('utf-8');

      // Donwload the message:
      let rawData = "";
      incomingMessage.on('data', chunk => {
        rawData += chunk;
      });

      // Send the message to the observer:
      incomingMessage.on('end', () => {
        observer.next(rawData);
        observer.complete();
      });
    }
  }

}
