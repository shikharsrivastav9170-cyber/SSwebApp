import React from 'react';
import '../styles/globals.css';
import { Header } from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold">SSWebStudio CRM</h1>
        <p className="mt-2 text-gray-600">Welcome to the Sales CRM application.</p>
      </main>
    </div>
  );
}