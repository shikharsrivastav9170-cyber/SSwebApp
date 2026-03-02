import React from 'react';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <button className="w-full bg-blue-600 text-white py-2 rounded mb-2">
          Sign in with Google
        </button>
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Sign in with Phone
        </button>
      </div>
    </main>
  );
}