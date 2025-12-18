'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import { useFilter } from '../../context/FilterContext';

export default function RevenueSalesOverview() {
  const { filters, setFilter } = useFilter();
  const [revenueData, setRevenueData] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [olapData, setOlapData] = useState([]);
  const [drillDown, setDrillDown] = useState(null);
  const [pivotState, setPivotState] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/q1-top-revenue').then(res => res.json()),
      fetch('/api/q2-discount').then(res => res.json()),
      fetch('/api/olap-cube').then(res => res.json()),
    ]).then(([rev, disc, olap]) => {
      setRevenueData(rev);
      setDiscountData(disc);
      setOlapData(olap);
    });
  }, []);

  const filteredRevenue = revenueData.filter(d => !filters.product || d.ProductName === filters.product);
  const filteredDiscount = discountData.filter(d => !filters.discount || d.DiscountStatus === filters.discount);

  const handleBarClick = (data) => {
    setFilter('product', data.ProductName);
    setDrillDown(data.ProductName);  // Drill-down
  };

  const handlePieClick = (data) => {
    setFilter('discount', data.DiscountStatus);  // Cross-filter
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl">Revenue & Promotion Analysis</h1>

      <section>
        <h2 className="text-xl">1. Produk mana yang memberikan kontribusi revenue tertinggi dalam 3 tahun terakhir (Top 10)?</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredRevenue} onClick={handleBarClick}>
            <XAxis dataKey="ProductName" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="TotalRevenue" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        {drillDown && <p>Drill-down details for {drillDown} (add monthly chart here)</p>}
      </section>

      <section>
        <h2 className="text-xl">2. Seberapa besar pengaruh penggunaan diskon (SpecialOffer) terhadap peningkatan jumlah penjualan?</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={filteredDiscount} dataKey="TotalQuantity" nameKey="DiscountStatus" fill="#82ca9d" onClick={handlePieClick} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      <section>
        <h2 className="text-xl">OLAP Mondrian View (Interaktif Pivot Table)</h2>
        <PivotTableUI data={olapData} onChange={setPivotState} {...pivotState} />
      </section>
    </div>
  );
}