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
      SELECT d.Year, p.ProductName, s.TotalRevenue, so.DiscountPct AS Discount, s.OrderQuantity
      FROM factsales s
      JOIN dimdate d ON s.DateKey = d.DateKey
      JOIN dimproduct p ON s.ProductKey = p.ProductKey
      JOIN dimspecialoffer so ON s.SpecialOfferKey = so.SpecialOfferKey
      LIMIT 500  -- limit for performance, expand if needed
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}