// src/components/App.js

import React, { useState } from 'react';
import AccountInputForm from './AccountInputForm';
import FinancialReports from './FinancialReports';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  
  const handleSubmit = (accountData) => {
    setAccounts([...accounts, accountData]);
  };

  return (
    <div className="app-container">
      <div className="left-pane">
        <AccountInputForm onSubmit={handleSubmit} />
      </div>
      <div className="right-pane">
        <FinancialReports accounts={accounts} />
      </div>
    </div>
  );
};

export default App;
