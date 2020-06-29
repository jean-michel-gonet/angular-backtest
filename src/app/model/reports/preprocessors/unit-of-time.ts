export enum UnitOfTime {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR'
}

export class UnitsOfTime {
  constructor(public over: number, public unitOfTime: UnitOfTime) {}

  public startingFrom(instant: Date): Date {
    switch(this.unitOfTime) {
      case UnitOfTime.DAY:
        return new Date(
          instant.getFullYear(),
          instant.getMonth(),
          instant.getDate() + this.over);

      case UnitOfTime.MONTH:
        return new Date(
          instant.getFullYear(),
          instant.getMonth() + this.over,
          instant.getDate());

      case UnitOfTime.YEAR:
        return new Date(
          instant.getFullYear() + this.over,
          instant.getMonth(),
          instant.getDate());
    }
  }
}
