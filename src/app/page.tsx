'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from './types/finance';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinancialSummary from './components/FinancialSummary';
import EditTransactionForm from './components/EditTransactionForm';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [loading, setLoading] = useState(true);

  // Student information
  const studentInfo = {
    name: 'Shane Raymond',
    nim: '535240098',
  };

  // Load data from database
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Transaction functions
  const addTransaction = async (transactionData: TransactionFormData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        fetchTransactions(); // Refresh data
        setShowTransactionForm(false);
      }
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const updateTransaction = async (transactionData: TransactionFormData) => {
    if (!editingTransaction) return;

    try {
      const response = await fetch(`/api/transactions/${editingTransaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (response.ok) {
        fetchTransactions(); // Refresh data
        setEditingTransaction(null);
      }
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTransactions(); // Refresh data
      }
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    switch (filter) {
      case 'income': return transaction.type === 'income';
      case 'expense': return transaction.type === 'expense';
      default: return true;
    }
  });

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Student Information */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center">
              <h1 className="text-primary mb-3">Personal Finance Tracker</h1>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="card bg-light">
                    <div className="card-body py-3">
                      <h5 className="card-title mb-2">Student Information</h5>
                      <p className="card-text mb-1">
                        <strong>Name:</strong> {studentInfo.name}
                      </p>
                      <p className="card-text mb-1">
                        <strong>NIM:</strong> {studentInfo.nim}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <FinancialSummary transactions={transactions} />

      {/* Add Transaction Button */}
      <div className="row mb-4">
        <div className="col-12">
          <button
            className="btn btn-primary w-100"
            onClick={() => setShowTransactionForm(!showTransactionForm)}
          >
            {showTransactionForm ? 'Cancel' : '+ Add New Transaction'}
          </button>
        </div>
      </div>

      {/* Transaction Form */}
      {showTransactionForm && (
        <div className="row mb-4">
          <div className="col-12">
            <TransactionForm 
              onSubmit={addTransaction} 
              onCancel={() => setShowTransactionForm(false)} 
            />
          </div>
        </div>
      )}

      {/* Edit Transaction Form */}
      {editingTransaction && (
        <div className="row mb-4">
          <div className="col-12">
            <EditTransactionForm 
              transaction={editingTransaction}
              onSubmit={updateTransaction}
              onCancel={() => setEditingTransaction(null)}
            />
          </div>
        </div>
      )}

      {/* Transactions Section */}
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">All Transactions</h5>
          <div className="btn-group">
            <button
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`btn btn-sm ${filter === 'income' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => setFilter('income')}
            >
              Income
            </button>
            <button
              className={`btn btn-sm ${filter === 'expense' ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => setFilter('expense')}
            >
              Expenses
            </button>
          </div>
        </div>
        <div className="card-body">
          <TransactionList 
            transactions={filteredTransactions} 
            onDelete={deleteTransaction}
            onEdit={setEditingTransaction}
          />
        </div>
      </div>
    </div>
  );
}