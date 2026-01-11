
import React from 'react';
import { Transaction, Expense } from '../types';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  expenses: Expense[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, expenses }) => {
  const totalSales = transactions.reduce((sum, tx) => sum + tx.total, 0);
  const totalExp = expenses.reduce((sum, ex) => sum + ex.amount, 0);
  const profit = totalSales - totalExp;

  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString([], { weekday: 'short' });
    const daySales = transactions.filter(tx => new Date(tx.timestamp).toDateString() === d.toDateString()).reduce((s, tx) => s + tx.total, 0);
    return { name: dayStr, sales: daySales };
  });

  return (
    <div className="space-y-8 pb-20 no-print">
      <div className="flex justify-between items-end">
        <div><h2 className="text-3xl font-bold">Business Overview</h2><p className="text-stone-500 italic">Financial health at a glance (RM).</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Revenue', value: `RM ${totalSales.toFixed(2)}`, color: 'emerald' },
          { label: 'Profit', value: `RM ${profit.toFixed(2)}`, color: 'blue' },
          { label: 'Orders', value: transactions.length, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
        <h3 className="text-lg font-bold mb-8">Sales Trend (Last 7 Days)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `RM${v}`} />
              <Tooltip formatter={(value) => [`RM ${value}`, 'Sales']} />
              <Area type="monotone" dataKey="sales" stroke="#10b981" fill="#10b98133" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
