'use client';

import React, { useState } from 'react';
import { authService } from '../../../lib/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'google' | 'email' | 'phone'>('google');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await authService.signInWithGoogle();
    if (error) {
      toast.error(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleEmailSignIn = async () => {
    if (!email) {
      toast.error('Please enter an email');
      return;
    }
    setLoading(true);
    const { error } = await authService.signInWithEmail(email);
    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success('Check your email for a login link');
    }
    setLoading(false);
  };

  const handlePhoneSignIn = async () => {
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }
    setLoading(true);
    const { error } = await authService.signInWithPhone(phone);
    if (error) {
      toast.error(`Error: ${error.message}`);
    } else {
      toast.success('Check your SMS for a login code');
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-4">SSWebStudio CRM</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('google')}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold ${
              tab === 'google'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setTab('email')}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold ${
              tab === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setTab('phone')}
            className={`flex-1 py-2 px-4 rounded text-sm font-semibold ${
              tab === 'phone'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            Phone
          </button>
        </div>

        {tab === 'google' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>
        )}

        {tab === 'email' && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded mb-3"
            />
            <button
              onClick={handleEmailSignIn}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </div>
        )}

        {tab === 'phone' && (
          <div>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded mb-3"
            />
            <button
              onClick={handlePhoneSignIn}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP via SMS'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}