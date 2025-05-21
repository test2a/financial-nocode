import React, { useState, useEffect } from 'react';
// Update the import path to match your actual file location
import AccountInputForm from './AccountInputForm'; // Direct import from src folder
import FinancialReportView from './financialreportview'; // Import the FinancialReportView component
function App() {
  const [accounts, setAccounts] = useState([]);
  const [editingAccount, setEditingAccount] = useState(null);

  // Example function to handle form submission
  const handleAccountSubmit = (accountData) => {
    if (editingAccount) {
      // Update existing account
      const updatedAccounts = accounts.map(account => 
        account.id === editingAccount.id ? { ...account, ...accountData } : account
      );
      setAccounts(updatedAccounts);
      setEditingAccount(null);
    } else {
      // Add new account with a unique ID
      const newAccount = {
        ...accountData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setAccounts([...accounts, newAccount]);
    }
  };

  // Function to handle editing an account
  const handleEditAccount = (account) => {
    setEditingAccount(account);
  };

  // Function to handle deleting an account
  const handleDeleteAccount = (accountId) => {
    const filteredAccounts = accounts.filter(account => account.id !== accountId);
    setAccounts(filteredAccounts);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Accounting Application</h1>
      </header>
      
      <main>
        <section className="form-section">
          <h2>{editingAccount ? 'Edit Account' : 'Add New Account'}</h2>
          <AccountInputForm 
            onSubmit={handleAccountSubmit} 
            initialData={editingAccount}
          />
        </section>
        
        {/* Account list section will be added later */}
        <section className="accounts-section">
          <h2>Accounts</h2>
          {accounts.length === 0 ? (
            <p>No accounts added yet.</p>
          ) : (
            <div className="account-list">
              {accounts.map(account => (
                <div key={account.id} className="account-item">
                  <h3>{account.accountName}</h3>
                  <p>Type: {account.accountType}</p>
                  <p>Amount: ${parseFloat(account.amount).toFixed(2)}</p>
                  <p>Date: {new Date(account.date).toLocaleDateString()}</p>
                  {account.description && <p>Description: {account.description}</p>}
                  <div className="account-actions">
                    <button onClick={() => handleEditAccount(account)}>Edit</button>
                    <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;