# Angular Backtest

A library to backtest investment strategies addressing the particular needs
of the private, non professional investor.

## Introduction

### What is it for?

Backtesting is a term used in modelling to refer to testing a predictive model
on historical data. Backtesting is a type of retrodiction, and a special type
of cross-validation applied to previous time period(s).
(see https://en.wikipedia.org/wiki/Backtesting).

In layman terms, backtesting consists in devising some kind of investment
strategy, download historical data relevant to the strategy, and see how it
would have performed in the past.

The most used tool for backtesting is Excel. While it does wonders to verify
the initial idea of the strategy, you soon stumble over the complexities of an
investment system - the order costs, the custody costs, the currency exchange,
the taxes... Plus, you would need to write your strategy in VBA, which is not
of the taste of everyone.

### Who is it for?
This project is for anyone seeking FIRE: Financial Independence
Retire Early, as it addresses some of the issues common to these individuals:
* They're private individuals, so trade operations have a significant cost that
  may impact their level of financial independence.
* They may live in a foreign country, so currency exchange rates have a significant
  impact on their level of financial independence.
* They're non qualified, non professional investors, so they don't have
  access to all investment products.
* They're exposed to a life-threatening risk if their investment fail, as they
  may loose their financial independence.

More generally, this project is for anyone who wonders if the strategies
described in all those youtube channels are as wonderful as it looks like,
and if they're feasible in practical life.

Ah, and also, to use this project you need some knowledge of programming
language. Not a lot, but some. Because you need to configure your strategy,
download the financial data, and make it work.

### Beware of over fit
Besides having bugs in the calculation, the most immediate danger of backtesting
is called overfitting

In statistics, overfitting is _the production of an analysis that corresponds
too closely or exactly to a particular set of data, and may therefore fail to
fit additional data or predict future observations reliably_
(see https://en.wikipedia.org/wiki/Overfitting)

When they show you documentation about an investment instrument at the bank, you
often can see, in small letters, a statement saying _Past Performance Is No
Guarantee of Future Results_, it is also a warning agains overfitting.

Imagine that you spot some instrument A you want to invest into, and you discover
that some other instrument B tends to rise a couple of months before. Astutely, you
set up a strategy where you buy shares of A as soon as you detect a raise in B. You
backtest this strategy, and it does wonders. Jackpot! Or is it? The fact that
B is correlated to A may be consequence of a thousand factors, and they may change
just because economy evolves.

## How to use the library


## Documentation I used to write the code:

This is some of my reference documentation:

- https://www.positronx.io/angular-chart-js-tutorial-with-ng2-charts-examples/
- This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.9.
