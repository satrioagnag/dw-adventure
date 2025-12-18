"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function RevenuePage() {
  const [data, setData] = useState<any[]>([]); // pastikan ini array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/revenue-top-products");

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const result = await res.json();

        const dataArray = Array.isArray(result) ? result : [result];

        setData(dataArray);
      } catch (err) {
        console.error(err);
        setError("Gagal ambil data dari database");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Loading data revenue...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (data.length === 0)
    return <p>Tidak ada data (mungkin query belum ada hasil)</p>;

  return (
    <div className="p-8">
      <h2 className="text-2xl mb-4">
        1. Produk mana yang memberikan kontribusi revenue tertinggi dalam 3
        tahun terakhir?
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="ProductName"
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TotalRevenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Debug: tampilkan data mentah */}
      <pre className="mt-8 text-sm bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
