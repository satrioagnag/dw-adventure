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
      SELECT p.ProductName, COUNT(*) AS LowStockCount
      FROM factinventory i
      JOIN dimproduct p ON i.ProductKey = p.ProductKey
      WHERE i.EndOfDayQuantity < p.SafetyStockLevel
      GROUP BY p.ProductName
      ORDER BY LowStockCount DESC
      LIMIT 10
    `);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}