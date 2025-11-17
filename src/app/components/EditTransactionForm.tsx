'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '../types/finance';

interface EditTransactionFormProps {
  transaction: Transaction;
  onSubmit: (transactionData: TransactionFormData) => void;
  onCancel: () => void;
}

export default function EditTransactionForm({ transaction, onSubmit, onCancel }: EditTransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: 0,
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const [amountInput, setAmountInput] = useState('');

  const expenseCategories = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Bonus', 'Other'];

  useEffect(() => {
    // Pre-fill form with transaction data
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split('T')[0],
    });
    setAmountInput(transaction.amount.toString());
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amountInput) || 0;
    
    if (amountValue > 0 && formData.description.trim()) {
      onSubmit({
        ...formData,
        amount: amountValue
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'amount') {
      setAmountInput(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card border-warning">
      <div className="card-header bg-warning text-dark">
        <h5 className="card-title mb-0">Edit Transaction</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="edit-type" className="form-label">Type</label>
            <select
              className="form-select"
              id="edit-type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">💰 Expense</option>
              <option value="income">💵 Income</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="edit-amount" className="form-label">Amount (Rp) *</label>
            <input
              type="number"
              className="form-control"
              id="edit-amount"
              name="amount"
              value={amountInput}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="edit-category" className="form-label">Category</label>
            <select
              className="form-select"
              id="edit-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="edit-date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="edit-date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="edit-description" className="form-label">Description *</label>
            <input
              type="text"
              className="form-control"
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe this transaction..."
              required
            />
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-warning">
            Update Transaction
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}