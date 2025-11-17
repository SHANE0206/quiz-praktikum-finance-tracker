import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getTransactionId(request: NextRequest): string | null {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/');
  const id = pathSegments[pathSegments.length - 1];
  return id || null;
}

// GET single transaction
export async function GET(request: NextRequest) {
  try {
    const id = getTransactionId(request);
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    console.log('🔍 GET Transaction ID:', id);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    console.log('🔍 Found transaction:', transaction);

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction' },
      { status: 500 }
    );
  }
}

// UPDATE transaction
export async function PUT(request: NextRequest) {
  try {
    const id = getTransactionId(request);
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { type, amount, category, description, date } = body;

    console.log('✏️ UPDATE Transaction ID:', id, 'Data:', body);

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        type,
        amount: parseFloat(amount),
        category,
        description,
        date: new Date(date),
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('UPDATE Error:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// DELETE transaction
export async function DELETE(request: NextRequest) {
  try {
    const id = getTransactionId(request);
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    console.log('🗑️ DELETE Transaction ID:', id);

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!existingTransaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    console.log('✅ Transaction deleted successfully');
    
    return NextResponse.json({ 
      success: true,
      message: 'Transaction deleted successfully',
      deletedId: id 
    });
    
  } catch (error) {
    console.error('❌ DELETE Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to delete transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}