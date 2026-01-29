// Financial types for transactions, invoices, payments

export type SupportedCurrency = 'KES' | 'UGX' | 'TZS';

export interface Transaction {
  id: string;
  type: 'payment' | 'invoice' | 'refund';
  amount: number;
  currency: SupportedCurrency;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  referenceId?: string;
  userId: string;
  auditLog: AuditLogEntry[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  details?: string;
}

export interface Invoice {
  id: string;
  customerId: string;
  amount: number;
  currency: SupportedCurrency;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedAt: Date;
  dueAt: Date;
  paidAt?: Date;
  auditLog: AuditLogEntry[];
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  currency: SupportedCurrency;
  status: 'initiated' | 'completed' | 'failed';
  paidAt: Date;
  method: 'stripe' | 'mpesa' | 'bank' | 'cash';
  auditLog: AuditLogEntry[];
}
