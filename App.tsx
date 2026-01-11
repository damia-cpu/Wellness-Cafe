
import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, MenuItem, Transaction, Expense, AddOn, Category } from './types';
import { INITIAL_MENU, INITIAL_ADDONS } from './constants';
import POS from './components/POS';
import Admin from './components/Admin';
import Accounting from './components/Accounting';
import Reports from './components/Reports';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import { Coffee, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const [view, setView] = useState<ViewState>('Dashboard');
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Initialize data from local storage or defaults
  useEffect(() => {
    const savedMenu = localStorage.getItem('well_menu');
    const savedAddons = localStorage.getItem('well_addons');
    const savedTransactions = localStorage.getItem('well_transactions');
    const savedExpenses = localStorage.getItem('well_expenses');
    const savedAuth = sessionStorage.getItem('well_auth');

    if (savedAuth === 'true') setIsAuthenticated(true);
    setMenu(savedMenu ? JSON.parse(savedMenu) : INITIAL_MENU);
    setAddOns(savedAddons ? JSON.parse(savedAddons) : INITIAL_ADDONS);
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
    setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
  }, []);

  // Save data to local storage on changes
  useEffect(() => {
    if (menu.length > 0) localStorage.setItem('well_menu', JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    if (addOns.length > 0) localStorage.setItem('well_addons', JSON.stringify(addOns));
  }, [addOns]);

  useEffect(() => {
    localStorage.setItem('well_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('well_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'wellnesscafefsm') {
      setIsAuthenticated(true);
      sessionStorage.setItem('well_auth', 'true');
      setLoginError(null);
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const addTransaction = useCallback((tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction? This action is permanent and will remove it from all financial statements.')) {
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  }, []);

  const addExpense = useCallback((exp: Expense) => {
    setExpenses(prev => [exp, ...prev]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this expense? This action is permanent and will remove it from all financial statements.')) {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  }, []);

  const updateMenu = useCallback((updatedMenu: MenuItem[]) => {
    setMenu(updatedMenu);
  }, []);

  const updateAddOns = useCallback((updatedAddOns: AddOn[]) => {
    setAddOns(updatedAddOns);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border border-stone-200">
          <div className="text-center mb-8">
            <div className="bg-emerald-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <Coffee size={32} />
            </div>
            <h1 className="text-3xl font-bold text-stone-900">Wellness Café</h1>
            <p className="text-stone-500 mt-2">Private Management System</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2 ml-1">Password Required</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-stone-900 font-mono"
                  placeholder="••••••••"
                  autoFocus
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
              </div>
              {loginError && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{loginError}</p>}
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-800 transition-all transform active:scale-[0.98]"
            >
              Access System
            </button>
          </form>
          <p className="text-center text-stone-400 text-[10px] mt-12 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'POS':
        return <POS menu={menu} addOns={addOns} onCompleteTransaction={addTransaction} />;
      case 'Admin':
        return <Admin menu={menu} addOns={addOns} onUpdateMenu={updateMenu} onUpdateAddOns={updateAddOns} />;
      case 'Accounting':
        return (
          <Accounting 
            transactions={transactions} 
            expenses={expenses} 
            onAddExpense={addExpense} 
            onDeleteTransaction={deleteTransaction}
            onDeleteExpense={deleteExpense}
            onAddTransaction={addTransaction}
            menu={menu}
          />
        );
      case 'Reports':
        return <Reports transactions={transactions} expenses={expenses} />;
      case 'Dashboard':
        return <Dashboard transactions={transactions} expenses={expenses} />;
      default:
        return <Dashboard transactions={transactions} expenses={expenses} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-50">
      <Sidebar currentView={view} onViewChange={setView} className="no-print" />
      <main className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
