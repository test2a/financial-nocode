import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Download, Printer, Settings } from 'lucide-react';

const FinancialReportView = ({ accountData, ratios }) => {
  const [customization, setCustomization] = useState({
    showHeader: true,
    companyName: "Your Company Name",
    reportDate: new Date().toISOString().split('T')[0],
    currencySymbol: "$",
    showPercentageChange: true,
    decimalPlaces: 2,
    fontScale: 1,
  });
  
  const [showSettings, setShowSettings] = useState(false);

  // Helper functions to calculate totals
  const calculateTotals = (data) => {
    if (!data) return { assets: 0, liabilities: 0, equity: 0, revenue: 0, expenses: 0 };
    
    // These calculations would be much more sophisticated in a real app
    const totalAssets = 
      (data.cash || 0) + 
      (data.accountsReceivable || 0) + 
      (data.inventory || 0) + 
      (data.prepaidExpenses || 0) + 
      (data.fixedAssets || 0) - 
      (data.accumulatedDepreciation || 0) + 
      (data.investments || 0) + 
      (data.intangibleAssets || 0);
      
    const totalLiabilities = 
      (data.accountsPayable || 0) + 
      (data.shortTermLoans || 0) + 
      (data.accruedExpenses || 0) + 
      (data.unearvedRevenue || 0) + 
      (data.longTermDebt || 0) + 
      (data.deferredTaxes || 0);
      
    const totalEquity = 
      (data.commonStock || 0) + 
      (data.retainedEarnings || 0) + 
      (data.additionalPaidInCapital || 0) - 
      (data.treasuryStock || 0);
      
    const totalRevenue = (data.revenue || 0);
    
    const totalExpenses = 
      (data.costOfGoodsSold || 0) + 
      (data.operatingExpenses || 0) + 
      (data.depreciation || 0) + 
      (data.interestExpense || 0) + 
      (data.taxExpense || 0);
      
    const netIncome = totalRevenue - totalExpenses;
    
    return {
      assets: totalAssets,
      liabilities: totalLiabilities,
      equity: totalEquity,
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome: netIncome
    };
  };
  
  const currentTotals = calculateTotals(accountData.currentYear);
  const previousTotals = calculateTotals(accountData.previousYear);
  
  // Calculate financial ratios 
  const calculateRatio = (formula, data) => {
    try {
      // This is a simplified implementation
      // A real app would use a proper formula parser
      const vars = {
        totalAssets: data.assets,
        currentAssets: (data.cash || 0) + (data.accountsReceivable || 0) + (data.inventory || 0) + (data.prepaidExpenses || 0),
        fixedAssets: (data.fixedAssets || 0) - (data.accumulatedDepreciation || 0),
        totalLiabilities: data.liabilities,
        currentLiabilities: (data.accountsPayable || 0) + (data.shortTermLoans || 0) + (data.accruedExpenses || 0),
        totalEquity: data.equity,
        revenue: data.revenue,
        grossProfit: data.revenue - (accountData.currentYear.costOfGoodsSold || 0),
        netIncome: data.netIncome
      };
      
      // Convert formula expressions to JavaScript
      let jsFormula = formula
        .replace(/totalAssets/g, vars.totalAssets)
        .replace(/currentAssets/g, vars.currentAssets)
        .replace(/fixedAssets/g, vars.fixedAssets)
        .replace(/totalLiabilities/g, vars.totalLiabilities)
        .replace(/currentLiabilities/g, vars.currentLiabilities)
        .replace(/totalEquity/g, vars.totalEquity)
        .replace(/revenue/g, vars.revenue)
        .replace(/grossProfit/g, vars.grossProfit)
        .replace(/netIncome/g, vars.netIncome);
        
      return eval(jsFormula);
    } catch (e) {
      console.error("Error calculating ratio:", e);
      return "Error";
    }
  };
  
  // Format currency values
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return customization.currencySymbol + "0.00";
    return customization.currencySymbol + value.toFixed(customization.decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Calculate percentage change
  const calculateChange = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous) * 100;
  };
  
  // Format percentage change
  const formatChange = (change) => {
    if (change === null) return "";
    const prefix = change >= 0 ? "+" : "";
    return `${prefix}${change.toFixed(1)}%`;
  };
  
  // Get appropriate color class for percentage change
  const getChangeColorClass = (change) => {
    if (change === null) return "";
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Financial Reports</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded hover:bg-gray-100"
            title="Report Settings"
          >
            <Settings size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100" title="Print Report">
            <Printer size={16} />
          </button>
          <button className="p-2 rounded hover:bg-gray-100" title="Download Report">
            <Download size={16} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h3 className="text-sm font-medium mb-2">Report Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Company Name</label>
              <input 
                type="text"
                value={customization.companyName}
                onChange={(e) => setCustomization({...customization, companyName: e.target.value})}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Report Date</label>
              <input 
                type="date"
                value={customization.reportDate}
                onChange={(e) => setCustomization({...customization, reportDate: e.target.value})}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Currency Symbol</label>
              <input 
                type="text"
                value={customization.currencySymbol}
                onChange={(e) => setCustomization({...customization, currencySymbol: e.target.value})}
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Decimal Places</label>
              <select
                value={customization.decimalPlaces}
                onChange={(e) => setCustomization({...customization, decimalPlaces: parseInt(e.target.value)})}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2 text-sm">
                <input 
                  type="checkbox"
                  checked={customization.showHeader}
                  onChange={(e) => setCustomization({...customization, showHeader: e.target.checked})}
                  className="rounded"
                />
                <span>Show Report Header</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center space-x-2 text-sm">
                <input 
                  type="checkbox"
                  checked={customization.showPercentageChange}
                  onChange={(e) => setCustomization({...customization, showPercentageChange: e.target.checked})}
                  className="rounded"
                />
                <span>Show Percentage Changes</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-4">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected ? 'bg-white shadow' : 'text-blue-700 hover:bg-white/[0.12]'}`
          }>
            Balance Sheet
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected ? 'bg-white shadow' : 'text-blue-700 hover:bg-white/[0.12]'}`
          }>
            Income Statement
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected ? 'bg-white shadow' : 'text-blue-700 hover:bg-white/[0.12]'}`
          }>
            Financial Ratios
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2 h-[calc(100%-80px)] overflow-y-auto">
          <Tab.Panel className="rounded-xl p-3">
            {/* Balance Sheet Report */}
            <div className="space-y-6">
              {customization.showHeader && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{customization.companyName}</h2>
                  <h3 className="text-lg font-medium">Balance Sheet</h3>
                  <p className="text-sm text-gray-600">As of {new Date(customization.reportDate).toLocaleDateString()}</p>
                </div>
              )}
              
              {/* Assets Section */}
              <div>
                <h4 className="text-md font-bold border-b-2 border-gray-800 pb-1 mb-2">Assets</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 font-medium text-sm text-gray-800 pb-1">
                    <div>Account</div>
                    <div className="text-right">Previous Year</div>
                    <div className="text-right">Current Year</div>
                    {customization.showPercentageChange && <div className="text-right">Change</div>}
                  </div>
                  
                  {/* Current Assets */}
                  <div className="pl-2">
                    <div className="font-medium text-sm mb-1">Current Assets</div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Cash and Cash Equivalents</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.cash)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.cash)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.cash, accountData.previousYear?.cash))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.cash, accountData.previousYear?.cash))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Accounts Receivable</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.accountsReceivable)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.accountsReceivable)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.accountsReceivable, accountData.previousYear?.accountsReceivable))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.accountsReceivable, accountData.previousYear?.accountsReceivable))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Inventory</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.inventory)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.inventory)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.inventory, accountData.previousYear?.inventory))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.inventory, accountData.previousYear?.inventory))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Fixed Assets */}
                  <div className="pl-2 mt-2">
                    <div className="font-medium text-sm mb-1">Non-Current Assets</div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Property, Plant & Equipment</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.fixedAssets)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.fixedAssets)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.fixedAssets, accountData.previousYear?.fixedAssets))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.fixedAssets, accountData.previousYear?.fixedAssets))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Accumulated Depreciation</div>
                      <div className="text-right">({formatCurrency(accountData.previousYear?.accumulatedDepreciation)})</div>
                      <div className="text-right">({formatCurrency(accountData.currentYear?.accumulatedDepreciation)})</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.accumulatedDepreciation, accountData.previousYear?.accumulatedDepreciation))}`}>
                          {formatChange(-calculateChange(accountData.currentYear?.accumulatedDepreciation, accountData.previousYear?.accumulatedDepreciation))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Total Assets */}
                  <div className="grid grid-cols-4 gap-2 font-bold text-sm pt-2 border-t">
                    <div>Total Assets</div>
                    <div className="text-right">{formatCurrency(previousTotals.assets)}</div>
                    <div className="text-right">{formatCurrency(currentTotals.assets)}</div>
                    {customization.showPercentageChange && (
                      <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.assets, previousTotals.assets))}`}>
                        {formatChange(calculateChange(currentTotals.assets, previousTotals.assets))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Liabilities and Equity Section */}
              <div>
                <h4 className="text-md font-bold border-b-2 border-gray-800 pb-1 mb-2">Liabilities and Equity</h4>
                
                {/* Liabilities */}
                <div className="space-y-2">
                  <div className="pl-2">
                    <div className="font-medium text-sm mb-1">Liabilities</div>
                    
                    {/* Current Liabilities */}
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Accounts Payable</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.accountsPayable)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.accountsPayable)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.accountsPayable, accountData.previousYear?.accountsPayable))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.accountsPayable, accountData.previousYear?.accountsPayable))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Short-term Loans</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.shortTermLoans)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.shortTermLoans)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.shortTermLoans, accountData.previousYear?.shortTermLoans))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.shortTermLoans, accountData.previousYear?.shortTermLoans))}
                        </div>
                      )}
                    </div>
                    
                    {/* Long-term Liabilities */}
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Long-term Debt</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.longTermDebt)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.longTermDebt)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.longTermDebt, accountData.previousYear?.longTermDebt))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.longTermDebt, accountData.previousYear?.longTermDebt))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Total Liabilities */}
                  <div className="grid grid-cols-4 gap-2 font-bold text-sm pt-2 border-t">
                    <div>Total Liabilities</div>
                    <div className="text-right">{formatCurrency(previousTotals.liabilities)}</div>
                    <div className="text-right">{formatCurrency(currentTotals.liabilities)}</div>
                    {customization.showPercentageChange && (
                      <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.liabilities, previousTotals.liabilities))}`}>
                        {formatChange(calculateChange(currentTotals.liabilities, previousTotals.liabilities))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Equity */}
                <div className="space-y-2 mt-4">
                  <div className="pl-2">
                    <div className="font-medium text-sm mb-1">Equity</div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Common Stock</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.commonStock)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.commonStock)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.commonStock, accountData.previousYear?.commonStock))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.commonStock, accountData.previousYear?.commonStock))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm py-1">
                      <div>Retained Earnings</div>
                      <div className="text-right">{formatCurrency(accountData.previousYear?.retainedEarnings)}</div>
                      <div className="text-right">{formatCurrency(accountData.currentYear?.retainedEarnings)}</div>
                      {customization.showPercentageChange && (
                        <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.retainedEarnings, accountData.previousYear?.retainedEarnings))}`}>
                          {formatChange(calculateChange(accountData.currentYear?.retainedEarnings, accountData.previousYear?.retainedEarnings))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Total Equity */}
                  <div className="grid grid-cols-4 gap-2 font-bold text-sm pt-2 border-t">
                    <div>Total Equity</div>
                    <div className="text-right">{formatCurrency(previousTotals.equity)}</div>
                    <div className="text-right">{formatCurrency(currentTotals.equity)}</div>
                    {customization.showPercentageChange && (
                      <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.equity, previousTotals.equity))}`}>
                        {formatChange(calculateChange(currentTotals.equity, previousTotals.equity))}
                      </div>
                    )}
                  </div>
                  
                  {/* Total Liabilities and Equity */}
                  <div className="grid grid-cols-4 gap-2 font-bold text-sm pt-2 border-t-2 border-gray-800">
                    <div>Total Liabilities and Equity</div>
                    <div className="text-right">{formatCurrency(previousTotals.liabilities + previousTotals.equity)}</div>
                    <div className="text-right">{formatCurrency(currentTotals.liabilities + currentTotals.equity)}</div>
                    {customization.showPercentageChange && (
                      <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.liabilities + currentTotals.equity, previousTotals.liabilities + previousTotals.equity))}`}>
                        {formatChange(calculateChange(currentTotals.liabilities + currentTotals.equity, previousTotals.liabilities + previousTotals.equity))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="rounded-xl p-3">
            {/* Income Statement Report */}
            <div className="space-y-6">
              {customization.showHeader && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{customization.companyName}</h2>
                  <h3 className="text-lg font-medium">Income Statement</h3>
                  <p className="text-sm text-gray-600">For the period ending {new Date(customization.reportDate).toLocaleDateString()}</p>
                </div>
              )}
              
              {/* Revenue Section */}
              <div>
                <h4 className="text-md font-bold pb-1 mb-2">Revenue</h4>
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Revenue</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.revenue)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.revenue)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(calculateChange(accountData.currentYear?.revenue, accountData.previousYear?.revenue))}`}>
                      {formatChange(calculateChange(accountData.currentYear?.revenue, accountData.previousYear?.revenue))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 font-medium text-sm pt-2 border-t">
                  <div>Total Revenue</div>
                  <div className="text-right">{formatCurrency(previousTotals.revenue)}</div>
                  <div className="text-right">{formatCurrency(currentTotals.revenue)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.revenue, previousTotals.revenue))}`}>
                      {formatChange(calculateChange(currentTotals.revenue, previousTotals.revenue))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Expenses Section */}
              <div>
                <h4 className="text-md font-bold pb-1 mb-2">Expenses</h4>
                
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Cost of Goods Sold</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.costOfGoodsSold)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.costOfGoodsSold)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.costOfGoodsSold, accountData.previousYear?.costOfGoodsSold))}`}>
                      {formatChange(-calculateChange(accountData.currentYear?.costOfGoodsSold, accountData.previousYear?.costOfGoodsSold))}
                    </div>
                  )}
                </div>
              
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Operating Expenses</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.operatingExpenses)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.operatingExpenses)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.operatingExpenses, accountData.previousYear?.operatingExpenses))}`}>
                      {formatChange(-calculateChange(accountData.currentYear?.operatingExpenses, accountData.previousYear?.operatingExpenses))}
                    </div>
                  )}
                </div>
              
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Depreciation Expense</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.depreciation)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.depreciation)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.depreciation, accountData.previousYear?.depreciation))}`}>
                      {formatChange(-calculateChange(accountData.currentYear?.depreciation, accountData.previousYear?.depreciation))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Interest Expense</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.interestExpense)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.interestExpense)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.interestExpense, accountData.previousYear?.interestExpense))}`}>
                      {formatChange(-calculateChange(accountData.currentYear?.interestExpense, accountData.previousYear?.interestExpense))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 text-sm py-1">
                  <div>Tax Expense</div>
                  <div className="text-right">{formatCurrency(accountData.previousYear?.taxExpense)}</div>
                  <div className="text-right">{formatCurrency(accountData.currentYear?.taxExpense)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(accountData.currentYear?.taxExpense, accountData.previousYear?.taxExpense))}`}>
                      {formatChange(-calculateChange(accountData.currentYear?.taxExpense, accountData.previousYear?.taxExpense))}
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-2 font-medium text-sm pt-2 border-t">
                  <div>Total Expenses</div>
                  <div className="text-right">{formatCurrency(previousTotals.expenses)}</div>
                  <div className="text-right">{formatCurrency(currentTotals.expenses)}</div>
                  {customization.showPercentageChange && (
                    <div className={`text-right ${getChangeColorClass(-calculateChange(currentTotals.expenses, previousTotals.expenses))}`}>
                      {formatChange(-calculateChange(currentTotals.expenses, previousTotals.expenses))}
                    </div>
                  )}
                </div>
              </div>
            
              {/* Net Income */}
              <div className="grid grid-cols-4 gap-2 font-bold text-sm pt-2 border-t-2 border-gray-800">
                <div>Net Income</div>
                <div className="text-right">{formatCurrency(previousTotals.netIncome)}</div>
                <div className="text-right">{formatCurrency(currentTotals.netIncome)}</div>
                {customization.showPercentageChange && (
                  <div className={`text-right ${getChangeColorClass(calculateChange(currentTotals.netIncome, previousTotals.netIncome))}`}>
                    {formatChange(calculateChange(currentTotals.netIncome, previousTotals.netIncome))}
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          <Tab.Panel className="rounded-xl p-3">
            {/* Financial Ratios Report */}
            <div className="space-y-6">
              {customization.showHeader && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold">{customization.companyName}</h2>
                  <h3 className="text-lg font-medium">Financial Ratios</h3>
                  <p className="text-sm text-gray-600">As of {new Date(customization.reportDate).toLocaleDateString()}</p>
                </div>
              )}
              
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-800">
                    <th className="text-left py-2">Ratio</th>
                    <th className="text-right py-2">Previous Year</th>
                    <th className="text-right py-2">Current Year</th>
                    <th className="text-right py-2">Threshold</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ratios.map((ratio) => {
                    const currentValue = calculateRatio(ratio.formula, currentTotals);
                    const previousValue = calculateRatio(ratio.formula, previousTotals);
                    const isGood = ratio.threshold && currentValue !== "Error" ? 
                      (ratio.name.includes('Debt') ? currentValue <= ratio.threshold : currentValue >= ratio.threshold) : 
                      null;
                      
                    return (
                      <tr key={ratio.id} className="border-b border-gray-200">
                        <td className="py-3">
                          <div className="font-medium">{ratio.name}</div>
                          <div className="text-xs text-gray-500">{ratio.formula}</div>
                        </td>
                        <td className="text-right py-3">
                          {previousValue === "Error" ? "N/A" : previousValue.toFixed(2)}
                        </td>
                        <td className="text-right py-3">
                          {currentValue === "Error" ? "N/A" : currentValue.toFixed(2)}
                        </td>
                        <td className="text-right py-3">{ratio.threshold}</td>
                        <td className="text-center py-3">
                          {isGood === null ? (
                            <span className="text-gray-500">N/A</span>
                          ) : isGood ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Good
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Alert
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="bg-blue-50 p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Notes on Financial Ratios</h4>
                <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                  <li>Current Ratio: Measures the company's ability to pay short-term obligations.</li>
                  <li>Debt-to-Equity: Indicates the relative proportion of shareholders' equity and debt used to finance assets.</li>
                  <li>Gross Profit Margin: Shows the percentage of revenue retained as gross profit.</li>
                </ul>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default FinancialReportView;