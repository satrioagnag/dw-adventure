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
      "SELECT p.ProductName, SUM(CASE WHEN c.CustomerType = 'Individual' THEN s.OrderCount ELSE 0 END) AS IndividualOrderFrequency, SUM(CASE WHEN c.CustomerType = 'Store' THEN s.OrderCount ELSE 0 END) AS ResellerOrderFrequency FROM factsales s JOIN dimproduct p ON s.ProductKey = p.ProductKey JOIN dimcustomer c ON s.CustomerKey = c.CustomerKey GROUP BY p.ProductName ORDER BY IndividualOrderFrequency DESC LIMIT 1;"
    );
    return NextResponse.json({ success: true, data: rows });
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
