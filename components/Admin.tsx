
import React, { useState } from 'react';
import { MenuItem, Category, AddOn } from '../types';
import { Edit2, ToggleLeft, ToggleRight, Trash2, Plus, Info, X } from 'lucide-react';

interface AdminProps {
  menu: MenuItem[];
  addOns: AddOn[];
  onUpdateMenu: (updatedMenu: MenuItem[]) => void;
  onUpdateAddOns: (updatedAddOns: AddOn[]) => void;
}

const Admin: React.FC<AdminProps> = ({ menu, addOns, onUpdateMenu, onUpdateAddOns }) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingAddon, setEditingAddon] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    price: 0,
    category: Category.Coffee,
    available: true,
    description: ''
  });

  const toggleAvailability = (id: string) => {
    onUpdateMenu(menu.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  const updatePrice = (id: string, newPrice: number) => {
    onUpdateMenu(menu.map(item => item.id === id ? { ...item, price: newPrice } : item));
  };

  const deleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      onUpdateMenu(menu.filter(item => item.id !== id));
    }
  };

  const updateAddonPrice = (id: string, newPrice: number) => {
    onUpdateAddOns(addOns.map(a => a.id === id ? { ...a, price: newPrice } : a));
  };

  const handleAddItem = () => {
    if (!newItem.name || newItem.price < 0) return;
    const item: MenuItem = {
      id: `item-${Date.now()}`,
      name: newItem.name,
      price: newItem.price,
      category: newItem.category,
      available: newItem.available
    };
    onUpdateMenu([...menu, item]);
    setNewItem({ name: '', price: 0, category: Category.Coffee, available: true, description: '' });
    setShowAddModal(false);
  };

  const groupedMenu: Record<string, MenuItem[]> = menu.reduce((acc: Record<string, MenuItem[]>, item) => {
    const catName = item.category as string;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Admin Controls</h2>
          <p className="text-stone-500">Manage your menu, categories, and custom pricing.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center gap-2 hover:bg-emerald-700 transition-all"
        >
          <Plus size={20} /> Add New Menu Item
        </button>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-start gap-4">
        <Info className="text-emerald-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-bold text-emerald-900">Real-time Updates</h2>
          <p className="text-emerald-700 text-sm">
            Any changes made here are instantly available on the Point of Sale screen.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {Object.keys(groupedMenu).map((category) => {
            const items = groupedMenu[category];
            return (
              <div key={category} className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
                <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
                  <h3 className="font-bold text-stone-800">{category}</h3>
                </div>
                <div className="divide-y divide-stone-100">
                  {items.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-stone-50 transition-colors group">
                      <div className="flex-1">
                        <p className="font-medium text-stone-900">{item.name}</p>
                        <p className={`text-xs font-semibold ${item.available ? 'text-emerald-600' : 'text-stone-400 italic'}`}>
                          {item.available ? 'Available' : 'Out of Stock'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        {editingItem === item.id ? (
                          <input 
                            type="number"
                            step="0.01"
                            autoFocus
                            className="w-24 px-3 py-1.5 rounded-lg border border-emerald-500 focus:outline-none text-right font-bold"
                            value={item.price}
                            onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                            onBlur={() => setEditingItem(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingItem(null)}
                          />
                        ) : (
                          <button 
                            onClick={() => setEditingItem(item.id)}
                            className="flex items-center gap-1"
                          >
                            <span className="font-bold text-stone-800">RM {item.price.toFixed(2)}</span>
                            <Edit2 size={12} className="text-stone-300 hover:text-emerald-600 transition-colors" />
                          </button>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleAvailability(item.id)}
                            className={`transition-colors ${item.available ? 'text-emerald-600' : 'text-stone-300'}`}
                          >
                            {item.available ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                          </button>
                          <button 
                            onClick={() => deleteItem(item.id)}
                            className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold px-1">Add-ons Pricing</h2>
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
              <h3 className="font-bold text-stone-800">Customizations</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {addOns.map(addon => (
                <div key={addon.id} className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">{addon.name}</span>
                  {editingAddon === addon.id ? (
                    <input 
                      type="number"
                      step="0.01"
                      autoFocus
                      className="w-20 px-3 py-1.5 rounded-lg border border-emerald-500 focus:outline-none text-right font-bold"
                      value={addon.price}
                      onChange={(e) => updateAddonPrice(addon.id, parseFloat(e.target.value) || 0)}
                      onBlur={() => setEditingAddon(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingAddon(null)}
                    />
                  ) : (
                    <button 
                      onClick={() => setEditingAddon(addon.id)}
                      className="flex items-center gap-1 group"
                    >
                      <span className="font-bold text-stone-800">RM {addon.price.toFixed(2)}</span>
                      <Edit2 size={12} className="text-stone-300 group-hover:text-emerald-600 transition-colors" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-200 shadow-2xl">
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="text-xl font-bold text-stone-800">New Menu Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Item Name</label>
                <input 
                  type="text"
                  placeholder="e.g., Caramel Machiato"
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Price (RM)</label>
                  <input 
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newItem.price || ''}
                    onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Category</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value as Category})}
                  >
                    {Object.values(Category).filter(c => c !== Category.Other).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Description / Notes (Optional)</label>
                <textarea 
                  placeholder="Additional details for this item..."
                  className="w-full px-4 py-3 rounded-xl border border-emerald-900 bg-emerald-900 text-white placeholder:text-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none h-20 resize-none transition-all"
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                <span className="text-sm font-medium text-stone-700">Set as available</span>
                <button 
                  onClick={() => setNewItem({...newItem, available: !newItem.available})}
                  className={`transition-colors ${newItem.available ? 'text-emerald-600' : 'text-stone-300'}`}
                >
                  {newItem.available ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </div>

            <div className="p-6 bg-stone-50 border-t border-stone-200">
              <button 
                onClick={handleAddItem}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100"
              >
                Create Menu Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
