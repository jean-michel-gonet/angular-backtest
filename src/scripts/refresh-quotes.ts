import { UserInfo, userInfo } from 'os'
import { LinearRegression } from '../app/model/calculations/statistics/linear-regression'

export class Hello {
  public hello(name: string):string {
      let x: LinearRegression = new LinearRegression();
      x.regression(new Date(2001, 1, 1), 10);
      x.regression(new Date(2001, 1, 2), 12);
      x.regression(new Date(2001, 1, 2), 13);
      return 'Hello, ' + name + ": " + x.getA();
  }
}

const user: UserInfo<string> = userInfo();
let hello: Hello = new Hello();
console.log(`Result: ${hello.hello(user.username)}`)
