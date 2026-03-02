'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/useAuth';
import { LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-semibold">
        SSWebStudio CRM
      </Link>
      <nav className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded"
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/dashboard" className="mr-4">
              Dashboard
            </Link>
            <Link href="/login" className="bg-blue-600 text-white px-3 py-2 rounded">
              Login
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};
