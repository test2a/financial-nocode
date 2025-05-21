// src/components/FinancialReports.js

import React from 'react';

const generateReports = (accounts) => {
  const profitLoss = accounts
    .filter(acc => acc.accountType === 'income' || acc.accountType === 'expense')
    .reduce((acc, { accountType, previousYearAmount, currentYearAmount }) => {
      if (accountType === 'income') {
        acc.previousYearIncome += parseFloat(previousYearAmount || 0);
        acc.currentYearIncome += parseFloat(currentYearAmount || 0);
      } else if (accountType === 'expense') {
        acc.previousYearExpense += parseFloat(previousYearAmount || 0);
        acc.currentYearExpense += parseFloat(currentYearAmount || 0);
      }
      return acc;
    }, {
      previousYearIncome: 0,
      currentYearIncome: 0,
      previousYearExpense: 0,
      currentYearExpense: 0,
    });

  const balanceSheet = accounts
    .filter(acc => acc.accountType === 'asset' || acc.accountType === 'liability')
    .reduce((acc, { accountType, previousYearAmount, currentYearAmount }) => {
      if (accountType === 'asset') {
        acc.previousYearAssets += parseFloat(previousYearAmount || 0);
        acc.currentYearAssets += parseFloat(currentYearAmount || 0);
      } else if (accountType === 'liability') {
        acc.previousYearLiabilities += parseFloat(previousYearAmount || 0);
        acc.currentYearLiabilities += parseFloat(currentYearAmount || 0);
      }
      return acc;
    }, {
      previousYearAssets: 0,
      currentYearAssets: 0,
      previousYearLiabilities: 0,
      currentYearLiabilities: 0,
    });

  return { profitLoss, balanceSheet };
};

const FinancialReports = ({ accounts }) => {
  const { profitLoss, balanceSheet } = generateReports(accounts);

  return (
    <div className="financial-reports">
      <h3>Profit & Loss Statement</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Previous Year</th>
            <th>Current Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Income</td>
            <td>{profitLoss.previousYearIncome}</td>
            <td>{profitLoss.currentYearIncome}</td>
          </tr>
          <tr>
            <td>Expenses</td>
            <td>{profitLoss.previousYearExpense}</td>
            <td>{profitLoss.currentYearExpense}</td>
          </tr>
          <tr>
            <td>Net Profit</td>
            <td>{profitLoss.previousYearIncome - profitLoss.previousYearExpense}</td>
            <td>{profitLoss.currentYearIncome - profitLoss.currentYearExpense}</td>
          </tr>
        </tbody>
      </table>

      <h3>Balance Sheet</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Previous Year</th>
            <th>Current Year</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Assets</td>
            <td>{balanceSheet.previousYearAssets}</td>
            <td>{balanceSheet.currentYearAssets}</td>
          </tr>
          <tr>
            <td>Liabilities</td>
            <td>{balanceSheet.previousYearLiabilities}</td>
            <td>{balanceSheet.currentYearLiabilities}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReports;
