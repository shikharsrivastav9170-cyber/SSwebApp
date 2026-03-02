'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '../../components/Header';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link
          href="/admin"
          className={`block p-3 rounded ${
            pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/employees"
          className={`block p-3 rounded ${
            isActive('/admin/employees') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          Manage Employees
        </Link>
        <Link
          href="/admin/plans"
          className={`block p-3 rounded ${
            isActive('/admin/plans') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          Manage Plans
        </Link>
        <Link
          href="/admin/targets"
          className={`block p-3 rounded ${
            isActive('/admin/targets') ? 'bg-blue-600' : 'hover:bg-gray-800'
          }`}
        >
          Set Targets
        </Link>
      </nav>
    </aside>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
