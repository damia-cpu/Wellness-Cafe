
import React, { useState } from 'react';
import { Transaction, Expense, MenuItem } from '../types';
import { Trash2, X, ShoppingCart, CreditCard } from 'lucide-react';

interface AccountingProps {
  transactions: Transaction[];
  expenses: Expense[];
  onAddExpense: (exp: Expense) => void;
  onDeleteTransaction: (id: string) => void;
  onDeleteExpense: (id: string) => void;
  onAddTransaction: (tx: Transaction) => void;
  menu: MenuItem[];
}

const Accounting: React.FC<AccountingProps> = ({ 
  transactions, 
  expenses, 
  onAddExpense, 
  onDeleteTransaction, 
  onDeleteExpense,
  menu
}) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    category: 'Inventory' as Expense['category'],
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = () => {
    if (!newExpense.name || newExpense.amount <= 0) return;
    onAddExpense({
      id: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date(newExpense.date).getTime(),
      name: newExpense.name,
      amount: newExpense.amount,
      category: newExpense.category,
      description: newExpense.description
    });
    setNewExpense({ name: '', amount: 0, category: 'Inventory', description: '', date: new Date().toISOString().split('T')[0] });
    setShowAddExpense(false);
  };

  const getTransactionDescription = (tx: Transaction) => {
    if (tx.type === 'Manual') {
      const firstSale = tx.otherSales?.[0];
      return `Other Sale – ${firstSale?.name || 'Item'}${tx.otherSales && tx.otherSales.length > 1 ? ` (+${tx.otherSales.length - 1} more)` : ''}`;
    } else {
      const firstItem = tx.items?.[0];
      const menuItem = menu.find(m => m.id === firstItem?.menuItemId);
      const categoryLabel = menuItem ? menuItem.category : 'General';
      const itemName = firstItem ? firstItem.name : 'Unknown Item';
      return `Order – ${categoryLabel}: ${itemName}${tx.items.length > 1 ? ` (+${tx.items.length - 1} more)` : ''}`;
    }
  };

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Lifetime Sales</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-stone-900">RM {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
          <p className="text-sm font-medium text-stone-500 uppercase tracking-wider mb-2">Lifetime Expenses</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-stone-900">RM {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-xl shadow-emerald-200 text-white">
          <p className="text-sm font-medium text-emerald-100 uppercase tracking-wider mb-2">Net Profit</p>
          <span className="text-3xl font-bold">RM {(totalRevenue - totalExpenses).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Money In */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <ShoppingCart className="text-emerald-600" size={20} />
            <h2 className="text-xl font-bold">Transaction History (Money In)</h2>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 sticky top-0 border-b border-stone-200 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-stone-400 bg-white italic">No transactions found.</td>
                    </tr>
                  ) : (
                    transactions.map(tx => (
                      <tr key={tx.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium bg-white text-black">{new Date(tx.timestamp).toLocaleDateString('en-MY')}</td>
                        <td className="px-6 py-4 bg-white">
                          <p className="text-sm font-bold text-black">{getTransactionDescription(tx)}</p>
                          <p className="text-[10px] text-stone-400 uppercase font-bold mt-0.5">{tx.id}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-bold bg-white text-black">RM {tx.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center bg-white">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteTransaction(tx.id);
                            }}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Transaction"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Money Out */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <CreditCard className="text-red-600" size={20} />
              <h2 className="text-xl font-bold">Expenses & Purchases (Money Out)</h2>
            </div>
            <button 
              onClick={() => setShowAddExpense(true)} 
              className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200 no-print"
            >
              Add Expense
            </button>
          </div>
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-stone-50 sticky top-0 border-b border-stone-200 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider">Vendor / Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-wider text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-stone-400 bg-white italic">No expenses found.</td>
                    </tr>
                  ) : (
                    expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-stone-50 transition-colors group">
                        <td className="px-6 py-4 text-sm font-medium bg-white text-black">{new Date(exp.timestamp).toLocaleDateString('en-MY')}</td>
                        <td className="px-6 py-4 bg-white">
                          <p className="text-sm font-bold text-black">{exp.name}</p>
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full uppercase font-bold inline-block mt-1">{exp.category}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold bg-white text-black">-RM {exp.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center bg-white">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteExpense(exp.id);
                            }}
                            className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showAddExpense && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="text-xl font-bold text-stone-800">Add New Expense</h3>
              <button onClick={() => setShowAddExpense(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1 block">Expense Name / Vendor</label>
                <input type="text" placeholder="e.g., TNB Bill, Milk Supply" className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none" value={newExpense.name} onChange={e => setNewExpense({...newExpense, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase mb-1 block">Amount (RM)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none" value={newExpense.amount || ''} onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-stone-400 uppercase mb-1 block">Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-xs" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1 block">Category</label>
                <select className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white focus:ring-2 focus:ring-emerald-500 outline-none" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value as any})}>
                  <option>Inventory</option><option>Utilities</option><option>Rent</option><option>Staff</option><option>Marketing</option><option>Misc</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase mb-1 block">Details (Optional)</label>
                <textarea 
                  placeholder="Additional information about this payment..."
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none transition-all"
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
            </div>
            <div className="p-6 bg-stone-50 border-t border-stone-200">
              <button onClick={handleAddExpense} className="w-full bg-emerald-900 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 transition-transform active:scale-95">
                Record Expense RM {newExpense.amount.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounting;
