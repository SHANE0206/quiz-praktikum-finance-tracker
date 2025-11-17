'use client';

import { Transaction } from '../types/finance';
import Link from 'next/link';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">No transactions yet</p>
        <p className="text-muted">Start by adding your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="list-group list-group-flush">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="list-group-item">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start mb-1">
                <h6 className="mb-0">{transaction.description}</h6>
                <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                  {transaction.type === 'income' ? '💵 Income' : '💰 Expense'}
                </span>
              </div>
              <div className="d-flex gap-2 mb-2">
                <span className="badge bg-info text-dark">{transaction.category}</span>
                <small className="text-muted">
                  {new Date(transaction.date).toLocaleDateString('id-ID')}
                </small>
              </div>
            </div>
            <div className="text-end ms-3">
              <div className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </div>
              <div className="d-flex gap-1 mt-1">
                <Link href={`/transactions/${transaction.id}`} className="btn btn-sm btn-outline-primary">
                  View
                </Link>
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => onEdit(transaction)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(transaction.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}