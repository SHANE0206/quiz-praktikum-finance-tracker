'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Transaction } from '../../types/finance';
import Link from 'next/link';

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchTransaction(params.id as string);
    }
  }, [params.id]);

  const fetchTransaction = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching transaction with ID:', id);
      
      const response = await fetch(`/api/transactions/${id}`);
      const data = await response.json();
      
      console.log('📨 API Response:', data);
      
      if (response.ok) {
        setTransaction(data);
      } else {
        setError(data.error || 'Transaction not found');
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <Link href="/" className="btn btn-outline-secondary mb-4">
              ← Back to Dashboard
            </Link>
            
            <div className="card border-danger">
              <div className="card-body text-center py-5">
                <div className="text-danger display-4 mb-3">❌</div>
                <h3 className="text-danger">Transaction Not Found</h3>
                <p className="text-muted mb-4">
                  {error || 'The transaction you are looking for does not exist or may have been deleted.'}
                </p>
                <p className="text-muted small">
                  Transaction ID: <code>{params.id}</code>
                </p>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Link href="/" className="btn btn-primary">
                    Back to Dashboard
                  </Link>
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => fetchTransaction(params.id as string)}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <Link href="/" className="btn btn-outside-secondary mb-4">
            ← Back to Dashboard
          </Link>

          <div className="card shadow-sm">
            <div className="card-body text-center">
              <div className={`display-4 mb-3 ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {transaction.type === 'income' ? '💵' : '💰'}
              </div>
              <h2 className={`card-title ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {formatCurrency(transaction.amount)}
              </h2>
              <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'} fs-6`}>
                {transaction.type === 'income' ? 'INCOME' : 'EXPENSE'}
              </span>
            </div>
            
            <div className="card-body border-top">
              <div className="row">
                <div className="col-12 mb-4">
                  <strong className="text-muted">Description:</strong>
                  <p className="fs-5 mb-0 mt-1">{transaction.description}</p>
                </div>
                
                <div className="col-md-6 mb-3">
                  <strong className="text-muted">Category:</strong><br />
                  <span className="badge bg-info text-dark fs-6 mt-1">{transaction.category}</span>
                </div>
                
                <div className="col-md-6 mb-3">
                  <strong className="text-muted">Transaction Date:</strong><br />
                  <span className="fs-6 mt-1">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="col-md-6 mb-3">
                  <strong className="text-muted">Recorded On:</strong><br />
                  <span className="fs-6 mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="col-12 mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Transaction ID: <code>{transaction.id}</code>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}