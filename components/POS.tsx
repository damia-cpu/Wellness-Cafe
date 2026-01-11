
import React, { useState, useMemo } from 'react';
import { MenuItem, Category, AddOn, OrderItem, Transaction } from '../types';
import { SUGAR_LEVELS } from '../constants';
import { Plus, Minus, X, Check, PlusCircle, ShoppingBasket, Printer, RefreshCcw, Calendar } from 'lucide-react';
import Receipt from './Receipt';

interface POSProps {
  menu: MenuItem[];
  addOns: AddOn[];
  onCompleteTransaction: (tx: Transaction) => void;
}

const POS: React.FC<POSProps> = ({ menu, addOns, onCompleteTransaction }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Coffee);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeItem, setActiveItem] = useState<{ item: MenuItem; quantity: number; selectedAddOns: AddOn[]; sugar: string } | null>(null);
  const [showOtherSale, setShowOtherSale] = useState(false);
  const [otherSaleData, setOtherSaleData] = useState({ name: '', price: 0, qty: 1, note: '', date: new Date().toISOString().split('T')[0] });
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [checkoutDate, setCheckoutDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = Object.values(Category).filter(c => c !== Category.Other);

  const filteredMenu = useMemo(() => {
    return menu.filter(item => item.category === selectedCategory && item.available);
  }, [menu, selectedCategory]);

  const addToCart = (item: MenuItem) => {
    setActiveItem({ item, quantity: 1, selectedAddOns: [], sugar: '100%' });
  };

  const finalizeItem = () => {
    if (!activeItem) return;
    const newOrderItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      menuItemId: activeItem.item.id,
      name: activeItem.item.name,
      price: activeItem.item.price,
      quantity: activeItem.quantity,
      addOns: activeItem.selectedAddOns,
      sugarLevel: activeItem.sugar,
    };
    setCart([...cart, newOrderItem]);
    setActiveItem(null);
  };

  const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  const handleOtherSale = () => {
    if (!otherSaleData.name || otherSaleData.price <= 0) return;
    
    const tx: Transaction = {
      id: generateId('WNS-M'),
      timestamp: new Date(otherSaleData.date).getTime(),
      items: [],
      otherSales: [{
        name: otherSaleData.name,
        price: otherSaleData.price,
        quantity: otherSaleData.qty,
        description: otherSaleData.note
      }],
      total: otherSaleData.price * otherSaleData.qty,
      type: 'Manual'
    };
    onCompleteTransaction(tx);
    setLastTransaction(tx);
    setShowOtherSale(false);
    setOtherSaleData({ name: '', price: 0, qty: 1, note: '', date: new Date().toISOString().split('T')[0] });
  };

  const calculateItemTotal = (item: OrderItem) => {
    const addonsTotal = item.addOns.reduce((sum, a) => sum + a.price, 0);
    return (item.price + addonsTotal) * item.quantity;
  };

  const cartTotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const tx: Transaction = {
      id: generateId('WNS-R'),
      timestamp: new Date(checkoutDate).getTime(),
      items: cart,
      total: cartTotal,
      type: 'Regular'
    };
    onCompleteTransaction(tx);
    setLastTransaction(tx);
    setCart([]);
  };

  const printReceipt = () => {
    window.print();
  };

  const resetPOS = () => {
    setLastTransaction(null);
  };

  if (lastTransaction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-stone-100 max-w-lg w-full no-print">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} />
            </div>
            <h2 className="text-3xl font-bold text-stone-900">Checkout Success</h2>
            <p className="text-stone-500 text-[10px] uppercase tracking-widest mt-1">ID: {lastTransaction.id}</p>
            <p className="text-sm text-stone-400 mt-1">Date: {new Date(lastTransaction.timestamp).toLocaleDateString()}</p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">RM {lastTransaction.total.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={printReceipt}
              className="w-full bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-lg shadow-stone-200"
            >
              <Printer size={20} /> Print Customer Receipt
            </button>
            <button 
              onClick={resetPOS}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
            >
              <RefreshCcw size={20} /> Start New Order
            </button>
          </div>
        </div>

        <div className="hidden print:block receipt-container">
          <Receipt transaction={lastTransaction} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-10 no-print">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setShowOtherSale(true)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 flex items-center gap-1"
          >
            <PlusCircle size={14} /> Other Sales
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-2xl border border-stone-200 text-left hover:shadow-md transition-shadow group flex flex-col justify-between h-32"
            >
              <div>
                <h3 className="font-semibold text-stone-800 line-clamp-2">{item.name}</h3>
                <p className="text-emerald-600 font-bold mt-1">RM {item.price.toFixed(2)}</p>
              </div>
              <div className="self-end bg-stone-50 text-emerald-600 p-1 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Plus size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[calc(100vh-120px)] sticky top-4">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBasket className="text-emerald-600" />
            Order Basket
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 opacity-60 italic text-center px-4">
              <ShoppingBasket size={48} className="mb-2" />
              <p>Your basket is empty.<br/>Select items to start.</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="bg-stone-50 p-4 rounded-2xl relative group">
                <button 
                  onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 text-stone-300 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
                <div className="flex justify-between items-start mb-2">
                  <div className="pr-6">
                    <h4 className="font-semibold text-stone-800">{item.name} x {item.quantity}</h4>
                    <p className="text-[10px] text-stone-500 italic">Sugar: {item.sugarLevel}</p>
                    {item.addOns.map(a => (
                      <span key={a.id} className="text-[9px] bg-white border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded-md mr-1 mt-1 inline-block">
                        + {a.name}
                      </span>
                    ))}
                  </div>
                  <p className="font-bold text-stone-800">RM {calculateItemTotal(item).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-stone-50 rounded-b-3xl space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
              <Calendar size={12} /> Transaction Date
            </label>
            <input 
              type="date" 
              className="w-full bg-white border border-stone-200 px-3 py-2 rounded-xl text-xs font-bold"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>
          
          <div className="flex justify-between items-center text-xl font-bold text-stone-900 border-t border-stone-200 pt-4">
            <span>Total</span>
            <span className="text-emerald-700">RM {cartTotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
          >
            Checkout & Pay
          </button>
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-stone-800">{activeItem.item.name}</h3>
                <p className="text-stone-500 text-sm">Base price: RM {activeItem.item.price.toFixed(2)}</p>
              </div>
              <button onClick={() => setActiveItem(null)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setActiveItem({...activeItem, quantity: Math.max(1, activeItem.quantity - 1)})}
                    className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{activeItem.quantity}</span>
                  <button 
                    onClick={() => setActiveItem({...activeItem, quantity: activeItem.quantity + 1})}
                    className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-3">Add-ons</label>
                <div className="grid grid-cols-2 gap-2">
                  {addOns.map(add => {
                    const isSelected = activeItem.selectedAddOns.find(a => a.id === add.id);
                    return (
                      <button
                        key={add.id}
                        onClick={() => {
                          const newAddons = isSelected 
                            ? activeItem.selectedAddOns.filter(a => a.id !== add.id)
                            : [...activeItem.selectedAddOns, add];
                          setActiveItem({...activeItem, selectedAddOns: newAddons});
                        }}
                        className={`text-sm px-3 py-3 rounded-xl border transition-all text-left flex justify-between items-center ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-800' 
                            : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300'
                        }`}
                      >
                        <span className="font-medium">{add.name}</span>
                        <span className="text-[10px] font-bold opacity-60">+RM {add.price.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-3">Sugar Level</label>
                <div className="flex flex-wrap gap-2">
                  {SUGAR_LEVELS.map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveItem({...activeItem, sugar: s})}
                      className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                        activeItem.sugar === s 
                          ? 'bg-emerald-600 text-white border-emerald-600' 
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-200">
              <button 
                onClick={finalizeItem}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100"
              >
                Add to Order — RM {((activeItem.item.price + activeItem.selectedAddOns.reduce((s, a) => s + a.price, 0)) * activeItem.quantity).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {showOtherSale && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-stone-800">Other Sale / Note</h3>
              <button onClick={() => setShowOtherSale(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Item Name</label>
                <input 
                  type="text"
                  placeholder="e.g., Bread, Pastry, Gift"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={otherSaleData.name}
                  onChange={(e) => setOtherSaleData({...otherSaleData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Price (RM)</label>
                  <input 
                    type="number"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={otherSaleData.price || ''}
                    onChange={(e) => setOtherSaleData({...otherSaleData, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Qty</label>
                  <input 
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={otherSaleData.qty}
                    onChange={(e) => setOtherSaleData({...otherSaleData, qty: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Transaction Date</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  value={otherSaleData.date}
                  onChange={(e) => setOtherSaleData({...otherSaleData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Notes (Optional)</label>
                <textarea 
                  placeholder="Add optional notes here..."
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-24 resize-none transition-all"
                  value={otherSaleData.note}
                  onChange={(e) => setOtherSaleData({...otherSaleData, note: e.target.value})}
                />
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-200">
              <button 
                onClick={handleOtherSale}
                className="w-full bg-amber-600 text-white py-4 rounded-2xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-100"
              >
                Record Manual Sale — RM {(otherSaleData.price * otherSaleData.qty).toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
