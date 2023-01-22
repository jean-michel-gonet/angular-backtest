/**
 * Utility class to limit the number of calls per minute to an API.
 */
export class ThrottleLimit {
  private nextOperationNotBefore: Date = new Date();

  /**
   * Class constructor.
   * @param {number} intervalInMs The interval to wait between calls.
   */
  constructor(private intervalInMs: number) {
  }

  /**
   * Will execute the specified operation in due time.
   * Launches first operation immediately.
   * Next launch is scheduled for the specified interval of time.
   * Each subsequent call is scheduled further and further,leaving
   * the specified interval of time between launches.
   * @param {():void} operation The operation to execute.
   */
  executeInDueTime(operation: {(): void}):void {
    let now: Date = new Date();
    let timeOut: number = this.nextOperationNotBefore.getTime() -  now.getTime();

    // If we can launch immediately:
    if (timeOut <= 0) {
        this.nextOperationNotBefore = new Date(now.getTime() + this.intervalInMs);
        operation();
    }
    // If we have to wait:
    else {
      this.nextOperationNotBefore = new Date(this.nextOperationNotBefore.getTime() + this.intervalInMs);
      setTimeout(operation, timeOut);
    }
  }
}
