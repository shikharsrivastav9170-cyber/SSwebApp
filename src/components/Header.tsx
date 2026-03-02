import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => (
  <header className="w-full bg-white shadow p-4 flex justify-between items-center">
    <Link href="/" className="text-xl font-semibold">
      SSWebStudio CRM
    </Link>
    <nav>
      <Link href="/dashboard" className="mr-4">
        Dashboard
      </Link>
      <Link href="/login">Login</Link>
    </nav>
  </header>
);
