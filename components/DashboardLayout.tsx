"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen">
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard/sales">Sales Overview</Link>
          </li>
          <li>
            <Link href="/dashboard/products">Product Analysis</Link>
          </li>
          <li>
            <Link href="/dashboard/customers">Customer Geo</Link>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
