
import React from 'react';
import { Transaction } from '../types';

interface ReceiptProps {
  transaction: Transaction;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction }) => {
  return (
    <div className="receipt-print bg-white p-6 text-stone-900 font-mono text-sm max-w-[300px] mx-auto border-dashed border-2 border-stone-200">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-tighter">Wellness Café</h2>
        <p className="text-[10px]">Lot 123, Ground Floor, Wellness Mall</p>
        <p className="text-[10px]">Kuala Lumpur, Malaysia</p>
        <p className="text-[10px]">Tel: +60 3-1234 5678</p>
      </div>

      <div className="border-b border-dashed border-stone-300 pb-2 mb-2 text-[10px]">
        <div className="flex justify-between">
          <span>Receipt:</span>
          <span>{transaction.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date(transaction.timestamp).toLocaleString('en-MY')}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="uppercase">{transaction.type}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {transaction.items.map((item, idx) => (
          <div key={idx} className="border-b border-stone-50 pb-2">
            <div className="flex justify-between font-bold">
              <span>{item.name} x{item.quantity}</span>
              <span>RM {(item.price * item.quantity).toFixed(2)}</span>
            </div>
            {item.sugarLevel !== '100%' && (
              <p className="text-[9px] text-stone-500 italic">Sugar: {item.sugarLevel}</p>
            )}
            {item.addOns.map((add, i) => (
              <div key={i} className="flex justify-between text-[9px] text-stone-600 pl-2">
                <span>+ {add.name}</span>
                <span>RM {(add.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        ))}
        {transaction.otherSales?.map((other, idx) => (
          <div key={idx} className="flex justify-between font-bold border-b border-stone-50 pb-2">
            <span>{other.name} x{other.quantity}</span>
            <span>RM {(other.price * other.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-stone-300 pt-2 space-y-1">
        <div className="flex justify-between text-lg font-bold">
          <span>TOTAL</span>
          <span>RM {transaction.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-8 space-y-1">
        <p className="text-[10px] font-bold">THANK YOU!</p>
        <p className="text-[9px]">Please come again.</p>
        <div className="mt-4 opacity-20">
          <div className="h-8 bg-stone-900 w-full mb-1"></div>
          <p className="text-[8px]">POS BY WELLNESS CAFE</p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
