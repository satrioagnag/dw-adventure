import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const config = { 
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER as string,
    database: process.env.DB_DATABASE as string,
    port: parseInt(process.env.DB_PORT || "3306"),
 };

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(`
      SELECT sp.SalesPersonName, sp.SalesQuota,
        SUM(s.TotalRevenue) AS TotalSales
      FROM factsales s
      JOIN dimsalesperson sp ON s.SalesPersonKey = sp.SalesPersonKey
      JOIN dimdate d ON s.DateKey = d.DateKey
      WHERE d.Year >= 2004  -- "last year" in data
      GROUP BY sp.SalesPersonName, sp.SalesQuota
      ORDER BY TotalSales DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}