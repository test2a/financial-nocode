import React, { useState, useEffect } from 'react';

// Make sure to properly export the component
const AccountInputForm = ({ onSubmit, initialData }) => {
  // Initialize accountData with default empty values or from props
  const [accountData, setAccountData] = useState({
    accountName: '',
    accountType: 'expense',
    amount: '',
    date: new Date().toISOString().substr(0, 10),
    description: '',
    ...(initialData || {}) // Spread the initialData if it exists
  });

  // If initialData changes (like when editing an existing entry)
  useEffect(() => {
    if (initialData) {
      setAccountData({
        ...accountData,
        ...initialData
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData({
      ...accountData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate data before submitting
    if (!accountData.accountName || !accountData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    onSubmit(accountData);
    // Reset form after submission if needed
    if (!initialData) {
      setAccountData({
        accountName: '',
        accountType: 'expense',
        amount: '',
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
          <input
            type="text"
            id="accountName"
            name="accountName"
            value={accountData.accountName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="accountType">Account Type:</label>
          <select
            id="accountType"
            name="accountType"
            value={accountData.accountType}
            onChange={handleChange}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={accountData.amount}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={accountData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={accountData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit">
          {initialData ? 'Update Account' : 'Add Account'}
        </button>
      </form>
    </div>
  );
};

// Make sure to export the component properly
export default AccountInputForm;