import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Settings, 
  Receipt, 
  BarChart3,
  Coffee
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, className }) => {
  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'POS', label: 'Point of Sale', icon: ShoppingCart },
    { id: 'Accounting', label: 'Accounting', icon: Receipt },
    { id: 'Admin', label: 'Menu', icon: Settings },
    { id: 'Reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <nav className={`bg-emerald-900 text-emerald-50 w-full md:w-64 flex-shrink-0 flex flex-col ${className}`}>
      <div className="p-6 flex items-center gap-3">
        <div className="bg-emerald-700 p-2 rounded-lg">
          <Coffee size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-none">Wellness</h1>
          <p className="text-[10px] uppercase tracking-widest text-emerald-400">Café Management</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-emerald-700 text-white shadow-lg' 
                  : 'hover:bg-emerald-800/50 text-emerald-200'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-emerald-800 hidden md:block">
        <p className="text-[10px] text-emerald-400 text-center uppercase tracking-tighter">
          v1.0.0 Standard License
        </p>
      </div>
    </nav>
);
};

export default Sidebar;