'use client';

import { Transaction } from '../types/finance';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export default function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="row mb-4">
      <div className="col-md-4 mb-3">
        <div className="card bg-success text-white">
          <div className="card-body text-center py-3">
            <h4 className="mb-1">{formatCurrency(totalIncome)}</h4>
            <small>Total Income</small>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className="card bg-danger text-white">
          <div className="card-body text-center py-3">
            <h4 className="mb-1">{formatCurrency(totalExpenses)}</h4>
            <small>Total Expenses</small>
          </div>
        </div>
      </div>
      <div className="col-md-4 mb-3">
        <div className={`card ${balance >= 0 ? 'bg-primary' : 'bg-warning'} text-white`}>
          <div className="card-body text-center py-3">
            <h4 className="mb-1">{formatCurrency(balance)}</h4>
            <small>Current Balance</small>
          </div>
        </div>
      </div>
    </div>
  );
}