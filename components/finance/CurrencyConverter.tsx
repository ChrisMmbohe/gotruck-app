// CurrencyConverter UI component example
'use client';
import React, { useState } from 'react';

const currencies = ['KES', 'UGX', 'TZS'] as const;

type Currency = typeof currencies[number];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState<Currency>('KES');
  const [to, setTo] = useState<Currency>('UGX');
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConvert(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/finance/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, from, to }),
      });
      const data = await res.json();
      if (res.ok) setResult(data.converted);
      else setError(data.error || 'Conversion failed');
    } catch (e) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleConvert} className="space-y-4 max-w-sm mx-auto p-4 border rounded bg-white">
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className="w-full border px-2 py-1 rounded"
          min={0}
          required
        />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-medium">From</label>
          <select value={from} onChange={e => setFrom(e.target.value as Currency)} className="w-full border px-2 py-1 rounded">
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">To</label>
          <select value={to} onChange={e => setTo(e.target.value as Currency)} className="w-full border px-2 py-1 rounded">
            {currencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? 'Converting...' : 'Convert'}
      </button>
      {result !== null && (
        <div className="mt-2 text-green-700 font-semibold">Converted: {result.toLocaleString()} {to}</div>
      )}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </form>
  );
}
