/**
 * An common class to be an ancestor of all errors happening while back testing.
 * Errors thrown extending this class will show their name, parent name,
 * parent's parent name, etc.
 * This class should be further extended to finely classify errors in the application.
 */
export class BackTestingError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = this.constructor.name;
  }
}
