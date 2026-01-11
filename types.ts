
export enum Category {
  Coffee = 'Brew-tiful Coffee',
  ChocolateMatcha = 'Whisked Me Away',
  MojitoLemonade = 'The Mojito Series',
  Tea = 'Tea Series',
  Other = 'Other'
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  addOns: AddOn[];
  sugarLevel: string;
}

export interface Transaction {
  id: string;
  timestamp: number;
  items: OrderItem[];
  otherSales?: {
    name: string;
    price: number;
    quantity: number;
    description: string;
  }[];
  total: number;
  type: 'Regular' | 'Manual';
}

export interface Expense {
  id: string;
  timestamp: number;
  name: string;
  amount: number;
  category: 'Inventory' | 'Utilities' | 'Rent' | 'Staff' | 'Marketing' | 'Misc';
  description: string;
}

export type ViewState = 'POS' | 'Admin' | 'Accounting' | 'Reports' | 'Dashboard';
