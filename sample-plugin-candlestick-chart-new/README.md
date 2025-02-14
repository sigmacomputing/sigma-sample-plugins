# React-Stockcharts Candlestick Chart Documentation

## Table of Contents

- [React-Stockcharts Candlestick Chart Documentation](#react-stockcharts-candlestick-chart-documentation)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Candlestick Charts Explained](#candlestick-charts-explained)
  - [Technical Specifications](#technical-specifications)
  - [Data Requirements](#data-requirements)

---

## Introduction

Welcome to the documentation of our React-Stockcharts Candlestick Chart! If you're looking for a comprehensive and dynamic tool to visualize financial data, you've come to the right place.

React-Stockcharts is a library built specifically for financial data visualizations in React.js. Among its range of chart types, the Candlestick chart is particularly popular due to its power and efficiency in displaying price movements over time.

---

## Candlestick Charts Explained

Candlestick charts, originating in Japan over 200 years ago, are used in technical analysis to represent price movements of an equity (stock, bond, commodity, etc.) over a specified time period. They are composed of individual "candles" that depict the open, high, low, and close prices for each time period.

A single candlestick consists of two parts:

1. **The body**: This rectangular area represents the opening and closing prices of the time period. If the body is filled (or colored), the asset closed lower than it opened (bearish). If it's unfilled (or a different color), the asset closed higher than it opened (bullish).
2. **The wicks**: Also known as shadows, these lines protrude from the top and bottom of the body, indicating the highest and lowest prices reached during the time period.

This combination allows a trader to understand price movements at a glance, providing more information than other chart types such as line or bar charts.

---

## Technical Specifications

Our Candlestick Chart is built with flexibility in mind, and as such, it's important to understand the data structure requirements. The chart is constructed based on a source dataset, which needs to be linked to specific column names in order for it to work correctly.

---

## Data Requirements

To generate a candlestick chart, the source data needs to consist of columns with specific names and data types as described below:

- **High**: This column should contain the highest prices achieved during each time period. The data type for this column must be numerical.
- **Low**: This column should contain the lowest prices achieved during each time period. The data type for this column must also be numerical.
- **Open**: This column represents the opening price for each time period. The data type for this column should be numerical as well.
- **Close**: This column should contain the closing prices for each time period. Like all the other price columns, the data type should be numerical.
- **Date**: The chart requires a 'Date' column which represents the start of the time period for each data point on the x-axis. The next x-axis point indicates the start time of the next time period. This column should be of the date data type.

The names for these columns are not case-sensitive but need to be provided exactly as mentioned above.

By ensuring your data aligns with these specifications, you will be able to generate an accurate and effective Candlestick Chart with React-Stockcharts. Enjoy the insights this rich visualization brings to your financial data!

---

We hope you found this documentation helpful. If you have any further queries, feel free to raise an issue in our [GitHub repository](https://github.com/sigmacomputing/sigma-sample-plugins).

Happy charting!
