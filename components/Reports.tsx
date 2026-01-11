
import React, { useState, useMemo, useEffect } from 'react';
import { Transaction, Expense } from '../types';
import { Printer, FileText, Landmark, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface ReportsProps {
  transactions: Transaction[];
  expenses: Expense[];
}

type ReportType = 'ProfitLoss' | 'FinancialPosition';
type TimeRange = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

const Reports: React.FC<ReportsProps> = ({ transactions, expenses }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('Monthly');
  const [activeReport, setActiveReport] = useState<ReportType>('ProfitLoss');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getEndOfPeriod = (date: Date, range: TimeRange) => {
    const end = new Date(date);
    if (range === 'Daily') {
      end.setHours(23, 59, 59, 999);
    } else if (range === 'Weekly') {
      end.setDate(end.getDate() - end.getDay() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (range === 'Monthly') {
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (range === 'Yearly') {
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
    }
    return end;
  };

  const getStartOfPeriod = (date: Date, range: TimeRange) => {
    const start = new Date(date);
    if (range === 'Daily') {
      start.setHours(0, 0, 0, 0);
    } else if (range === 'Weekly') {
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
    } else if (range === 'Monthly') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    } else if (range === 'Yearly') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    }
    return start;
  };

  const stats = useMemo(() => {
    const startOfPeriod = getStartOfPeriod(selectedDate, timeRange);
    const endOfPeriod = getEndOfPeriod(selectedDate, timeRange);
    
    // For Profit & Loss, we look ONLY at the range
    const filteredTxs = transactions.filter(tx => {
      return tx.timestamp >= startOfPeriod.getTime() && tx.timestamp <= endOfPeriod.getTime();
    });

    const filteredExpenses = expenses.filter(exp => {
      return exp.timestamp >= startOfPeriod.getTime() && exp.timestamp <= endOfPeriod.getTime();
    });

    const revenue = filteredTxs.reduce((sum, tx) => sum + tx.total, 0);
    const cost = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const menuRev = filteredTxs.filter(t => t.type === 'Regular').reduce((s, t) => s + t.total, 0);
    const otherRev = filteredTxs.filter(t => t.type === 'Manual').reduce((s, t) => s + t.total, 0);

    // For SOFP (Financial Position), we look at EVERYTHING up to the end of the selected period
    const cumulativeRev = transactions
      .filter(tx => tx.timestamp <= endOfPeriod.getTime())
      .reduce((sum, tx) => sum + tx.total, 0);
    
    const cumulativeExp = expenses
      .filter(exp => exp.timestamp <= endOfPeriod.getTime())
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { 
      revenue, cost, menuRev, otherRev, 
      profit: revenue - cost,
      cashAtHand: cumulativeRev - cumulativeExp,
      lifetimeRev: cumulativeRev, 
      lifetimeExp: cumulativeExp
    };
  }, [transactions, expenses, timeRange, selectedDate]);

  const handlePrint = () => {
    const originalTitle = document.title;
    const reportName = activeReport === 'ProfitLoss' ? 'Statement_of_Profit_or_Loss_and_Other_Comprehensive_Income' : 'Financial_Position_Statement';
    const dateStr = selectedDate.toISOString().split('T')[0];
    document.title = `${reportName}_${dateStr}`;
    
    window.print();
    
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const formatPeriodLabel = () => {
    if (timeRange === 'Daily') return selectedDate.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' });
    if (timeRange === 'Monthly') return selectedDate.toLocaleDateString('en-MY', { month: 'long', year: 'numeric' });
    if (timeRange === 'Yearly') return selectedDate.getFullYear().toString();
    if (timeRange === 'Weekly') {
      const start = new Date(selectedDate);
      start.setDate(selectedDate.getDate() - selectedDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-MY', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return "";
  };

  const renderProfitLoss = () => (
    <div className="report-page p-4 bg-white">
      <div className="flex justify-between items-start mb-12 border-b-4 border-emerald-900 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-1">Wellness Café</h1>
          <p className="text-stone-500 font-bold uppercase tracking-widest text-xs">Statement of Profit or Loss and Other Comprehensive Income</p>
          <p className="text-stone-400 text-[10px] mt-1">Reg No: 202401012345 (PLACEHOLDER)</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg">{formatPeriodLabel()}</p>
          <p className="text-sm text-stone-400 italic">Report generated on {new Date().toLocaleString('en-MY')}</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-xs font-bold border-b pb-2 mb-4 uppercase tracking-widest text-stone-400">Revenue</h3>
          <div className="space-y-3 pl-2">
            <div className="flex justify-between">
              <span className="text-stone-700">Operating Revenue (Menu Sales)</span>
              <span className="font-mono">RM {stats.menuRev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-700">Other Income (Manual/Miscellaneous Sales)</span>
              <span className="font-mono">RM {stats.otherRev.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-stone-100 pt-3 font-bold text-stone-900">
              <span className="uppercase text-sm">Total Revenue</span>
              <span className="text-lg">RM {stats.revenue.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold border-b pb-2 mb-4 uppercase tracking-widest text-stone-400">Operating Expenses</h3>
          <div className="space-y-3 pl-2">
            {['Inventory', 'Utilities', 'Rent', 'Staff', 'Marketing', 'Misc'].map(cat => {
              const start = getStartOfPeriod(selectedDate, timeRange).getTime();
              const end = getEndOfPeriod(selectedDate, timeRange).getTime();
              
              const amt = expenses
                .filter(e => e.timestamp >= start && e.timestamp <= end)
                .filter(e => e.category === cat)
                .reduce((s, e) => s + e.amount, 0);
              
              if (amt === 0) return null;
              return (
                <div key={cat} className="flex justify-between">
                  <span className="text-stone-600">{cat}</span>
                  <span className="font-mono text-red-600">(RM {amt.toFixed(2)})</span>
                </div>
              );
            })}
            <div className="flex justify-between border-t-2 border-stone-100 pt-3 font-bold text-red-700">
              <span className="uppercase text-sm">Total Operating Expenses</span>
              <span className="text-lg">(RM {stats.cost.toFixed(2)})</span>
            </div>
          </div>
        </section>

        <section className="bg-stone-50 p-6 border-y-2 border-stone-900 mt-12">
          <div className="flex justify-between text-2xl font-bold uppercase tracking-tighter">
            <span>Net Profit / (Loss) for the period</span>
            <span className={stats.profit >= 0 ? 'text-emerald-700' : 'text-red-700'}>
              RM {stats.profit.toFixed(2)}
            </span>
          </div>
        </section>
      </div>

      <div className="mt-24 pt-12 border-t border-stone-100 flex justify-between items-end">
        <div>
          <div className="w-48 h-px bg-stone-300 mb-2"></div>
          <p className="text-[10px] font-bold uppercase text-stone-400 tracking-widest">Authorized Signature</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-stone-300 italic">This is a computer-generated document and requires no physical signature for digital submission.</p>
        </div>
      </div>
    </div>
  );

  const renderFinancialPosition = () => {
    const endOfPeriod = getEndOfPeriod(selectedDate, timeRange);
    return (
      <div className="report-page p-4 bg-white">
        <div className="flex justify-between items-start mb-12 border-b-4 border-emerald-900 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-1">Wellness Café</h1>
            <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Statement of Financial Position</p>
            <p className="text-stone-400 text-xs mt-1">As at {endOfPeriod.toLocaleDateString('en-MY', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-stone-400 italic">Point-in-time Position</p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="text-xs font-bold border-b-2 border-black pb-2 mb-4 uppercase tracking-widest">Assets</h3>
            <div className="space-y-4 pl-2">
              <div className="flex justify-between font-medium">
                <span className="text-stone-700">Cash and Cash Equivalents (Closing Balance)</span>
                <span className="font-mono">RM {stats.cashAtHand.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-stone-400 italic">
                <span>Trade Receivables</span>
                <span className="font-mono">RM 0.00</span>
              </div>
              <div className="flex justify-between border-t-2 border-stone-900 mt-4 pt-3 font-bold bg-stone-50 p-4 rounded-lg">
                <span className="uppercase text-sm">Total Assets</span>
                <span className="text-xl">RM {stats.cashAtHand.toFixed(2)}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-bold border-b-2 border-black pb-2 mb-4 uppercase tracking-widest">Equity & Liabilities</h3>
            <div className="space-y-6 pl-2">
              <div>
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-3">Equity</p>
                <div className="flex justify-between pl-4">
                  <span className="text-stone-700">Retained Earnings (Accumulated Profit to Date)</span>
                  <span className="font-mono">RM {stats.cashAtHand.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-between border-t-2 border-stone-900 mt-4 pt-3 font-bold bg-stone-50 p-4 rounded-lg">
                <span className="uppercase text-sm">Total Equity and Liabilities</span>
                <span className="text-xl">RM {stats.cashAtHand.toFixed(2)}</span>
              </div>
            </div>
          </section>
        </div>
        
        <div className="mt-32 text-center border-t border-stone-100 pt-8">
          <p className="text-[10px] text-stone-300 uppercase tracking-[0.2em]">End of Statement of Financial Position</p>
        </div>
      </div>
    );
  };

  const changeDate = (offset: number) => {
    const next = new Date(selectedDate);
    if (timeRange === 'Daily') next.setDate(next.getDate() + offset);
    else if (timeRange === 'Monthly') next.setMonth(next.getMonth() + offset);
    else if (timeRange === 'Yearly') next.setFullYear(next.getFullYear() + offset);
    else if (timeRange === 'Weekly') next.setDate(next.getDate() + (offset * 7));
    setSelectedDate(next);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-3xl font-bold">Financial Reporting</h2>
          <p className="text-stone-500">Generate, view, and export accounting statements.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border rounded-2xl flex p-1 shadow-sm">
            <button 
              onClick={() => setActiveReport('ProfitLoss')} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeReport === 'ProfitLoss' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              <FileText size={16}/> P&L Statement
            </button>
            <button 
              onClick={() => setActiveReport('FinancialPosition')} 
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeReport === 'FinancialPosition' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-50'}`}
            >
              <Landmark size={16}/> Balance Sheet
            </button>
          </div>

          <button 
            onClick={handlePrint} 
            className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition-all"
          >
            <Printer size={18}/> Export to PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 p-4 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 no-print shadow-sm">
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === range ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => changeDate(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><ChevronLeft size={20}/></button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-stone-50 border border-stone-100 rounded-xl">
            <CalendarIcon size={16} className="text-emerald-600" />
            <span className="font-bold text-sm min-w-[120px] text-center">{formatPeriodLabel()}</span>
          </div>

          <button onClick={() => changeDate(1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-20 rounded-[3rem] border border-stone-100 shadow-2xl max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 transition-all duration-300">
        {activeReport === 'ProfitLoss' ? renderProfitLoss() : renderFinancialPosition()}
      </div>
    </div>
  );
};

export default Reports;
