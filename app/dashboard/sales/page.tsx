'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function RevenueSalesOverview() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/revenue-top-products')
      .then(res => res.json())
      .then(result => {
        // Pastikan selalu array
        const chartData = Array.isArray(result) ? result : [];
        setData(chartData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-white text-center py-10">Loading data dari database...</div>;
  if (data.length === 0) return <div className="text-red-500">Tidak ada data revenue</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        1. Produk mana yang memberikan kontribusi revenue tertinggi dalam 3 tahun terakhir?
      </h1>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 120 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="ProductName" 
            angle={-45} 
            textAnchor="end" 
            height={120}
            tick={{ fill: '#fff', fontSize: 12 }}
          />
          <YAxis tick={{ fill: '#fff' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none' }}
            formatter={(value: number | undefined) => value !== undefined ? `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 2 })}` : ''}
          />
          <Legend />
          <Bar dataKey="TotalRevenue" fill="#8b5cf6" name="Total Revenue" />
        </BarChart>
      </ResponsiveContainer>

      {/* Debug (bisa dihapus nanti) */}
      <details className="mt-8 text-xs text-gray-400">
        <summary>Lihat data mentah</summary>
        <pre className="bg-gray-900 p-4 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}