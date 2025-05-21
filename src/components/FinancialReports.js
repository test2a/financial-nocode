import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Papa from 'papaparse'; // Import the PapaParse library

// Function to generate reports based on the accounts data
const generateReports = (accounts) => {
  const profitLoss = {
    income: [],
    expense: [],
    revenue: 0,
    previousYearRevenue: 0,
    otherIncome: 0,
    previousYearOtherIncome: 0,
    cogs: 0,
    previousYearCogs: 0,
    operatingExpenses: 0,
    previousYearOperatingExpenses: 0,
    grossProfit: 0,
    previousYearGrossProfit: 0,
    netProfit: 0,
    previousYearNetProfit: 0,
    taxExpense: 0,
    previousYearTaxExpense: 0,
  };

  const balanceSheet = {
    capital: 0,
    reserves: 0,
    currentAssets: 0,
    previousYearCurrentAssets: 0,
    nonCurrentAssets: 0,
    previousYearNonCurrentAssets: 0,
    currentLiabilities: 0,
    previousYearCurrentLiabilities: 0,
    nonCurrentLiabilities: 0,
    previousYearNonCurrentLiabilities: 0,
  };

  // Categorize the accounts and calculate totals
  accounts.forEach(({ accountType, accountName, previousYearAmount, currentYearAmount, parentGroup }) => {
    if (accountType === 'income') {
      profitLoss.income.push({ accountName, currentYearAmount, previousYearAmount });
      profitLoss.revenue += parseFloat(currentYearAmount || 0);
      profitLoss.previousYearRevenue += parseFloat(previousYearAmount || 0);
    } else if (accountType === 'expense') {
      profitLoss.expense.push({ accountName, currentYearAmount, previousYearAmount });
      profitLoss.operatingExpenses += parseFloat(currentYearAmount || 0);
      profitLoss.previousYearOperatingExpenses += parseFloat(previousYearAmount || 0);
    } else if (accountType === 'costOfGoodsSold') {
      profitLoss.cogs += parseFloat(currentYearAmount || 0);
      profitLoss.previousYearCogs += parseFloat(previousYearAmount || 0);
    } else if (accountType === 'taxExpense') {
      profitLoss.taxExpense += parseFloat(currentYearAmount || 0);
      profitLoss.previousYearTaxExpense += parseFloat(previousYearAmount || 0);
    } else if (parentGroup === 'Current Assets') {
      if (accountType === 'asset') {
        balanceSheet.currentAssets += parseFloat(currentYearAmount || 0);
        balanceSheet.previousYearCurrentAssets += parseFloat(previousYearAmount || 0);
      }
    } else if (parentGroup === 'Non-Current Assets') {
      if (accountType === 'asset') {
        balanceSheet.nonCurrentAssets += parseFloat(currentYearAmount || 0);
        balanceSheet.previousYearNonCurrentAssets += parseFloat(previousYearAmount || 0);
      }
    } else if (parentGroup === 'Loans (Liability)') {
      if (accountType === 'liability') {
        balanceSheet.nonCurrentLiabilities += parseFloat(currentYearAmount || 0);
        balanceSheet.previousYearNonCurrentLiabilities += parseFloat(previousYearAmount || 0);
      }
    } else if (parentGroup === 'Current Liabilities') {
      if (accountType === 'liability') {
        balanceSheet.currentLiabilities += parseFloat(currentYearAmount || 0);
        balanceSheet.previousYearCurrentLiabilities += parseFloat(previousYearAmount || 0);
      }
    } else if (parentGroup === 'Capital Account') {
      if (accountType === 'capital') {
        balanceSheet.capital += parseFloat(currentYearAmount || 0);
      }
    }
  });

  profitLoss.grossProfit = profitLoss.revenue - profitLoss.cogs;
  profitLoss.previousYearGrossProfit = profitLoss.previousYearRevenue - profitLoss.previousYearCogs;

  profitLoss.netProfit = profitLoss.grossProfit - profitLoss.operatingExpenses - profitLoss.taxExpense;
  profitLoss.previousYearNetProfit = profitLoss.previousYearGrossProfit - profitLoss.previousYearOperatingExpenses - profitLoss.previousYearTaxExpense;

  // Add net profit to capital/owner's equity
  balanceSheet.capital += profitLoss.netProfit;

  return { profitLoss, balanceSheet };
};

// CSV Import Component
const ImportCSV = ({ onImport }) => {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!csvFile) {
      alert('Please select a file to import');
      return;
    }

    Papa.parse(csvFile, {
      complete: (result) => {
        const accounts = result.data.map(row => ({
          accountType: row[0],
          accountName: row[1],
          parentGroup: row[2],
          previousYearAmount: parseFloat(row[3] || 0),
          currentYearAmount: parseFloat(row[4] || 0),
        }));
        onImport(accounts); // Pass the imported data to the parent component
      },
      header: false,
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImport}>Import Accounts</button>
    </div>
  );
};

const FinancialReports = ({ initialAccounts = [] }) => {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [newAccount, setNewAccount] = useState({
    accountType: 'income',
    accountName: '',
    currentYearAmount: 0,
    previousYearAmount: 0,
    parentGroup: 'Current Assets', // Default parent group
  });

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target;
    setNewAccount((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddAccount = () => {
    const { accountType, accountName, currentYearAmount, previousYearAmount, parentGroup } = newAccount;

    if (!accountName) {
      alert('Account name is required');
      return;
    }

    const newAccountData = {
      accountType,
      accountName,
      currentYearAmount: parseFloat(currentYearAmount || 0),
      previousYearAmount: parseFloat(previousYearAmount || 0),
      parentGroup,
    };

    setAccounts((prevAccounts) => [...prevAccounts, newAccountData]);
    setNewAccount({
      accountType: 'income',
      accountName: '',
      currentYearAmount: 0,
      previousYearAmount: 0,
      parentGroup: 'Current Assets', // Reset to default group
    });
  };

  const handleCSVImport = (newAccounts) => {
    setAccounts((prevAccounts) => [...prevAccounts, ...newAccounts]);
  };

  const { profitLoss, balanceSheet } = generateReports(accounts);

  return (
    <div className="financial-reports">
      <h3>Profit & Loss Account for the Year Ended [Date]</h3>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Previous Year (₹)</th>
            <th>Current Year (₹)</th>
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
            <td>{profitLoss.previousYearRevenue}</td>
            <td>{profitLoss.revenue}</td>
          </tr>
          <tr>
            <td><strong>Total Expenses</strong></td>
            <td>{profitLoss.previousYearOperatingExpenses}</td>
            <td>{profitLoss.operatingExpenses}</td>
          </tr>
          <tr>
            <td><strong>Net Profit</strong></td>
            <td>{profitLoss.previousYearNetProfit}</td>
            <td>{profitLoss.netProfit}</td>
          </tr>
        </tbody>
      </table>

      <h3>Balance Sheet as of [Date]</h3>
      <table>
        <thead>
          <tr>
            <th>Account</th>
            <th>Previous Year (₹)</th>
            <th>Current Year (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Capital/Owner's Equity</td>
            <td>{balanceSheet.capital - profitLoss.netProfit}</td>
            <td>{balanceSheet.capital}</td>
          </tr>
          <tr>
            <td>Non-Current Liabilities</td>
            <td>{balanceSheet.previousYearNonCurrentLiabilities}</td>
            <td>{balanceSheet.nonCurrentLiabilities}</td>
          </tr>
          <tr>
            <td>Current Liabilities</td>
            <td>{balanceSheet.previousYearCurrentLiabilities}</td>
            <td>{balanceSheet.currentLiabilities}</td>
          </tr>
          <tr>
            <td><strong>Total Liabilities</strong></td>
            <td>{balanceSheet.previousYearNonCurrentLiabilities + balanceSheet.previousYearCurrentLiabilities}</td>
            <td>{balanceSheet.nonCurrentLiabilities + balanceSheet.currentLiabilities}</td>
          </tr>

          <tr>
            <td>Non-Current Assets</td>
            <td>{balanceSheet.previousYearNonCurrentAssets}</td>
            <td>{balanceSheet.nonCurrentAssets}</td>
          </tr>
          <tr>
            <td>Current Assets</td>
            <td>{balanceSheet.previousYearCurrentAssets}</td>
            <td>{balanceSheet.currentAssets}</td>
          </tr>
          <tr>
            <td><strong>Total Assets</strong></td>
            <td>{balanceSheet.previousYearNonCurrentAssets + balanceSheet.previousYearCurrentAssets}</td>
            <td>{balanceSheet.nonCurrentAssets + balanceSheet.currentAssets}</td>
          </tr>
        </tbody>
      </table>

      <h3>Add a New Account</h3>
      <div>
        <label>
          Account Type:
          <select name="accountType" value={newAccount.accountType} onChange={handleNewAccountChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="costOfGoodsSold">Cost of Goods Sold</option>
            <option value="taxExpense">Tax Expense</option>
            <option value="asset">Asset</option>
            <option value="nonCurrentAsset">Non-Current Asset</option>
            <option value="currentAsset">Current Asset</option>
            <option value="liability">Liability</option>
            <option value="nonCurrentLiability">Non-Current Liability</option>
            <option value="currentLiability">Current Liability</option>
            <option value="capital">Capital</option>
            <option value="reserves">Reserves</option>
          </select>
        </label>

        <label>
          Account Name:
          <input
            type="text"
            name="accountName"
            value={newAccount.accountName}
            onChange={handleNewAccountChange}
            placeholder="Account Name"
          />
        </label>

        <label>
          Parent Group:
          <select name="parentGroup" value={newAccount.parentGroup} onChange={handleNewAccountChange}>
            <option value="Current Assets">Current Assets</option>
            <option value="Non-Current Assets">Non-Current Assets</option>
            <option value="Loans (Liability)">Loans (Liability)</option>
            <option value="Capital Account">Capital Account</option>
            <option value="Current Liabilities">Current Liabilities</option>
          </select>
        </label>

        <label>
          Previous Year Amount:
          <input
            type="number"
            name="previousYearAmount"
            value={newAccount.previousYearAmount}
            onChange={handleNewAccountChange}
            placeholder="Previous Year Amount (₹)"
          />
        </label>

        <label>
          Current Year Amount:
          <input
            type="number"
            name="currentYearAmount"
            value={newAccount.currentYearAmount}
            onChange={handleNewAccountChange}
            placeholder="Current Year Amount (₹)"
          />
        </label>

        <button onClick={handleAddAccount}>Add Account</button>
      </div>

      <h3>Import Accounts from CSV</h3>
      <ImportCSV onImport={handleCSVImport} />
    </div>
  );
};

// Prop types to ensure correct data is passed
FinancialReports.propTypes = {
  initialAccounts: PropTypes.array,
};

export default FinancialReports;
