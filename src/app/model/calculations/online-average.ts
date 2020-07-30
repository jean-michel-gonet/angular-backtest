
/**
 * Calculates the average.
 * Online algorithms can process its input piece-by-piece in a serial fashion,
 * in the order that the input is fed to the algorithm, without having the entire
 * input available from the start (https://en.wikipedia.org/wiki/Online_algorithm).
 * @class{OnlineAverage}
 */
export class OnlineAverage {
  private avg: number;
  private n: number = 1;

  /**
   * Calculates the average.
   * @param{number} sample.
   * @return{number} The current average of all samples provided so far.
   */
  average(sample: number): number {
      if (this.n == 1) {
        this.avg = sample;
      } else {
        this.avg = this.avg + (sample - this.avg) / this.n;
      }
      this.n++;
      return this.avg;
  }
}
