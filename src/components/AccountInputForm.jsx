// src/components/AccountInputForm.js

import React, { useState, useEffect } from 'react';

const AccountInputForm = ({ onSubmit, initialData }) => {
  const [accountData, setAccountData] = useState({
    accountName: '',
    accountType: 'expense',
    previousYearAmount: '',
    currentYearAmount: '',
    date: new Date().toISOString().substr(0, 10),
    description: '',
    ...(initialData || {})
  });

  useEffect(() => {
    if (initialData) {
      setAccountData({ ...accountData, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({ ...accountData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountData.accountName || !accountData.previousYearAmount || !accountData.currentYearAmount) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(accountData);
    if (!initialData) {
      setAccountData({
        accountName: '',
        accountType: 'expense',
        previousYearAmount: '',
        currentYearAmount: '',
        date: new Date().toISOString().substr(0, 10),
        description: ''
      });
    }
  };

  return (
    <div className="account-input-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountName">Account Name:</label>
          <input type="text" id="accountName" name="accountName" value={accountData.accountName} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="accountType">Account Type:</label>
          <select id="accountType" name="accountType" value={accountData.accountType} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="previousYearAmount">Previous Year Amount:</label>
          <input type="number" id="previousYearAmount" name="previousYearAmount" value={accountData.previousYearAmount} onChange={handleChange} step="0.01" required />
        </div>

        <div className="form-group">
          <label htmlFor="currentYearAmount">Current Year Amount:</label>
          <input type="number" id="currentYearAmount" name="currentYearAmount" value={accountData.currentYearAmount} onChange={handleChange} step="0.01" required />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input type="date" id="date" name="date" value={accountData.date} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={accountData.description} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="submit-button">{initialData ? 'Update Account' : 'Add Account'}</button>
      </form>
    </div>
  );
};

export default AccountInputForm;
