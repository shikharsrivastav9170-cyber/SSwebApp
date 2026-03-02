import React from 'react';
import Link from 'next/link';

export const Sidebar: React.FC = () => (
  <aside className="w-64 bg-gray-100 p-4">
    <ul className="space-y-2">
      <li><Link href="/dashboard/leads">Leads</Link></li>
      <li><Link href="/dashboard/sales">Sales</Link></li>
      <li><Link href="/dashboard/targets">Targets</Link></li>
    </ul>
  </aside>
);
