
import { MenuItem, Category, AddOn } from './types';

export const INITIAL_MENU: MenuItem[] = [
  // Coffee
  { id: 'c1', name: 'Americano', category: Category.Coffee, price: 4.50, available: true },
  { id: 'c2', name: 'Latte', category: Category.Coffee, price: 5.50, available: true },
  { id: 'c3', name: 'Cappuccino', category: Category.Coffee, price: 5.50, available: true },
  { id: 'c4', name: 'Spanish Latte', category: Category.Coffee, price: 6.00, available: true },
  { id: 'c5', name: 'Mocha', category: Category.Coffee, price: 6.00, available: true },
  { id: 'c6', name: 'Hazelnut Latte', category: Category.Coffee, price: 6.50, available: true },
  { id: 'c7', name: 'Salted Caramel Latte', category: Category.Coffee, price: 6.50, available: true },
  { id: 'c8', name: 'Vanilla Latte', category: Category.Coffee, price: 6.50, available: true },
  // Chocolate & Matcha
  { id: 'm1', name: 'Chocolate', category: Category.ChocolateMatcha, price: 6.00, available: true },
  { id: 'm2', name: 'Chocolate Strawberry', category: Category.ChocolateMatcha, price: 6.50, available: true },
  { id: 'm3', name: 'Matcha', category: Category.ChocolateMatcha, price: 6.00, available: true },
  { id: 'm4', name: 'Matcha Strawberry', category: Category.ChocolateMatcha, price: 6.50, available: true },
  { id: 'm5', name: 'Matcha Mango', category: Category.ChocolateMatcha, price: 6.50, available: true },
  { id: 'm6', name: 'Matcha Chocolate', category: Category.ChocolateMatcha, price: 6.50, available: true },
  // Mojitos
  { id: 'j1', name: 'Blue Mojito', category: Category.MojitoLemonade, price: 7.00, available: true },
  { id: 'j2', name: 'Strawberry Mojito', category: Category.MojitoLemonade, price: 7.00, available: true },
  { id: 'j3', name: 'Apple Mojito', category: Category.MojitoLemonade, price: 7.00, available: true },
  { id: 'j4', name: 'Strawberry Lemonade', category: Category.MojitoLemonade, price: 6.50, available: true },
  { id: 'j5', name: 'Lemonade', category: Category.MojitoLemonade, price: 5.50, available: true },
  // Tea
  { id: 't1', name: 'Earl Grey', category: Category.Tea, price: 4.50, available: true },
  { id: 't2', name: 'Peach Tea', category: Category.Tea, price: 5.00, available: true },
  { id: 't3', name: 'Jasmine Tea', category: Category.Tea, price: 4.50, available: true },
  { id: 't4', name: 'Oolong Milk Peach Tea', category: Category.Tea, price: 6.00, available: true },
  { id: 't5', name: 'Teh Boh', category: Category.Tea, price: 3.50, available: true },
];

export const INITIAL_ADDONS: AddOn[] = [
  { id: 'a1', name: 'Oat Milk', price: 1.00 },
  { id: 'a2', name: 'Extra Shot', price: 0.50 },
  { id: 'a3', name: 'Caramel Syrup', price: 0.50 },
  { id: 'a4', name: 'Hazelnut Syrup', price: 0.50 },
  { id: 'a5', name: 'Vanilla Syrup', price: 0.50 },
];

export const SUGAR_LEVELS = ['100%', '75%', '50%', '25%', '0%'];
