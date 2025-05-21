// src/components/FinancialReports.js

import React from 'react';

const generateReports = (accounts) => {
  const profitLoss = {
    income: [],
    expense: [],
    previousYearIncome: 0,
    currentYearIncome: 0,
    previousYearExpense: 0,
    currentYearExpense: 0,
  };
  
  const balanceSheet = {
    asset: [],
    liability: [],
    previousYearAssets: 0,
    currentYearAssets: 0,
    previousYearLiabilities: 0,
    currentYearLiabilities: 0,
  };

  // Categorize the accounts and calculate totals
  accounts.forEach(({ accountType, accountName, previousYearAmount, currentYearAmount }) => {
    if (accountType === 'income') {
      profitLoss.income.push({ accountName, previousYearAmount, currentYearAmount });
      profitLoss.previousYearIncome += parseFloat(previousYearAmount || 0);
      profitLoss.currentYearIncome += parseFloat(currentYearAmount || 0);
    } else if (accountType === 'expense') {
      profitLoss.expense.push({ accountName, previousYearAmount, currentYearAmount });
      profitLoss.previousYearExpense += parseFloat(previousYearAmount || 0);
      profitLoss.currentYearExpense += parseFloat(currentYearAmount || 0);
    } else if (accountType === 'asset') {
      balanceSheet.asset.push({ accountName, previousYearAmount, currentYearAmount });
      balanceSheet.previousYearAssets += parseFloat(previousYearAmount || 0);
      balanceSheet.currentYearAssets += parseFloat(currentYearAmount || 0);
    } else if (accountType === 'liability') {
      balanceSheet.liability.push({ accountName, previousYearAmount, currentYearAmount });
      balanceSheet.previousYearLiabilities += parseFloat(previousYearAmount || 0);
      balanceSheet.currentYearLiabilities += parseFloat(currentYearAmount || 0);
    }
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
            <th>Account</th>
            <th>Previous Year</th>
            <th>Current Year</th>
          </tr>
        </thead>
        <tbody>
          {profitLoss.income.map((account, index) => (
            <tr key={`income-${index}`}>
              <td>{account.accountName}</td>
              <td>{account.previousYearAmount}</td>
              <td>{account.currentYearAmount}</td>
            </tr>
          ))}
          {profitLoss.expense.map((account, index) => (
            <tr key={`expense-${index}`}>
              <td>{account.accountName}</td>
              <td>{account.previousYearAmount}</td>
              <td>{account.currentYearAmount}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total Income</strong></td>
            <td>{profitLoss.previousYearIncome}</td>
            <td>{profitLoss.currentYearIncome}</td>
          </tr>
          <tr>
            <td><strong>Total Expenses</strong></td>
            <td>{profitLoss.previousYearExpense}</td>
            <td>{profitLoss.currentYearExpense}</td>
          </tr>
          <tr>
            <td><strong>Net Profit</strong></td>
            <td>{profitLoss.previousYearIncome - profitLoss.previousYearExpense}</td>
            <td>{profitLoss.currentYearIncome - profitLoss.currentYearExpense}</td>
          </tr>
        </tbody>
      </table>

      <h3>Balance Sheet</h3>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Previous Year</th>
            <th>Current Year</th>
          </tr>
        </thead>
        <tbody>
          {balanceSheet.asset.map((account, index) => (
            <tr key={`asset-${index}`}>
              <td>{account.accountName}</td>
              <td>{account.previousYearAmount}</td>
              <td>{account.currentYearAmount}</td>
            </tr>
          ))}
          {balanceSheet.liability.map((account, index) => (
            <tr key={`liability-${index}`}>
              <td>{account.accountName}</td>
              <td>{account.previousYearAmount}</td>
              <td>{account.currentYearAmount}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Total Assets</strong></td>
            <td>{balanceSheet.previousYearAssets}</td>
            <td>{balanceSheet.currentYearAssets}</td>
          </tr>
          <tr>
            <td><strong>Total Liabilities</strong></td>
            <td>{balanceSheet.previousYearLiabilities}</td>
            <td>{balanceSheet.currentYearLiabilities}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialReports;
