import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

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
    const [rows] = await connection.execute(
      "SELECT p.ProductName, SUM(s.TotalRevenue) AS TotalRevenue FROM factsales s JOIN dimproduct p ON s.ProductKey = p.ProductKey JOIN dimdate d ON s.DateKey = d.DateKey WHERE d.FullDate >= '2001-01-01' AND d.FullDate <= '2004-12-31' GROUP BY p.ProductName ORDER BY TotalRevenue DESC LIMIT 10;"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  } finally {
    if (connection) await connection.end();
  }
}
