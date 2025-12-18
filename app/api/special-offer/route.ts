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
      "SELECT CASE WHEN so.DiscountPct > 0 THEN 'With Discount' ELSE 'Without Discount' END AS DiscountStatus, SUM(s.OrderQuantity) AS TotalQuantity, SUM(s.TotalRevenue) AS TotalRevenue, (SUM(s.OrderQuantity) / (SELECT SUM(OrderQuantity) FROM factsales)) * 100 AS QuantityPercentage FROM factsales s JOIN dimspecialoffer so ON s.SpecialOfferKey = so.SpecialOfferKey GROUP BY DiscountStatus;"
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
