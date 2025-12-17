// app/api/test-connection/route.ts  ← buat dulu buat test koneksi
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

const config = {
  host: "localhost",
  user: "root",
  password: "", // kosong di XAMPP
  database: "dw_adventureworks", // ganti kalau nama DB kamu beda
  port: 3306,
};

export async function GET() {
  let connection;
  try {
    connection = await mysql.createConnection(config);
    const [rows] = await connection.execute(
      "SELECT * FROM dimlocation LIMIT 5"
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as Error).message });
  } finally {
    if (connection) await connection.end();
  }
}
