'use client';

import { useState } from 'react';
import { TransactionFormData } from '../types/finance';

interface TransactionFormProps {
  onSubmit: (transactionData: TransactionFormData) => void;
  onCancel?: () => void;
}

export default function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountValue = parseFloat(amountInput) || 0;
    
    if (amountValue > 0 && formData.description.trim()) {
      onSubmit({
        ...formData,
        amount: amountValue
      });
      // Reset form
      setFormData({
        type: 'expense',
        amount: 0,
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      setAmountInput('');
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
    <form onSubmit={handleSubmit} className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Add New Transaction</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="type" className="form-label">Type</label>
            <select
              className="form-select"
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="expense">💰 Expense</option>
              <option value="income">💵 Income</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="amount" className="form-label">Amount (Rp)</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              name="amount"
              value={amountInput}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              className="form-select"
              id="category"
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
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-12">
            <label htmlFor="description" className="form-label">Description *</label>
            <input
              type="text"
              className="form-control"
              id="description"
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
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
          {onCancel && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}