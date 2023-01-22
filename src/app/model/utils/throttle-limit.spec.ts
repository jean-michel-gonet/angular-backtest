import { fakeAsync, tick } from '@angular/core/testing';
import { ThrottleLimit } from "./throttle-limit";

describe('ThrottleLimit', () => {
  it('Can launch the first operation immediately', fakeAsync(() => {
    let tl = new ThrottleLimit(200);
    let hasExecuted:boolean = false;
    tl.executeInDueTime(() => {hasExecuted = true});
    expect(hasExecuted).toBeTrue();
  }));

  it('Can throttle subsequent operations', fakeAsync(() => {
    let tl = new ThrottleLimit(200);

    let hasExecuted1 = false;
    let hasExecuted2 = false;
    let hasExecuted3 = false;
    tl.executeInDueTime(() => {hasExecuted1 = true});
    tl.executeInDueTime(() => {hasExecuted2 = true});
    tl.executeInDueTime(() => {hasExecuted3 = true});

    expect(hasExecuted1).toBeTrue();
    expect(hasExecuted2).toBeFalse();
    expect(hasExecuted3).toBeFalse();

    tick(199);
    expect(hasExecuted1).toBeTrue();
    expect(hasExecuted2).toBeFalse();
    expect(hasExecuted3).toBeFalse();

    tick(2);
    expect(hasExecuted1).toBeTrue();
    expect(hasExecuted2).toBeTrue();
    expect(hasExecuted3).toBeFalse();

    tick(200);
    expect(hasExecuted1).toBeTrue();
    expect(hasExecuted2).toBeTrue();
    expect(hasExecuted3).toBeTrue();
  }));

  it('If enough time has passed, then can launch the next operation immediately', fakeAsync(() => {
    let tl = new ThrottleLimit(200);

    let hasExecuted1 = false;
    tl.executeInDueTime(() => {hasExecuted1 = true});
    expect(hasExecuted1).toBeTrue();

    tick(201);

    let hasExecuted2 = false;
    tl.executeInDueTime(() => {hasExecuted2 = true});
    expect(hasExecuted2).toBeTrue();
  }));
});
