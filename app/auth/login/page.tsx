"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to log in');
      }

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-md">
        <div className="rounded-[14px] border-2 p-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Log In</h1>
          <p className="mb-6" style={{ color: 'var(--color-muted-text)' }}>Welcome back! Sign in to your account</p>

          {error && (
            <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-[10px] border-2 p-4 flex items-start gap-3" style={{ backgroundColor: 'rgba(122, 155, 110, 0.05)', borderColor: 'var(--color-success)' }}>
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-success)' }} />
              <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-muted-text)' }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[8px] border-2 py-2 pl-10 pr-3 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="you@example.com"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-muted-text)' }} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[8px] border-2 py-2 pl-10 pr-3 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full rounded-[10px] px-4 py-2 text-white font-medium transition-all duration-200 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: isLoading || !email || !password ? 'var(--color-muted-text)' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.backgroundColor = '#8B5A3F';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && email && password) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }
              }}
              aria-label="Log in"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-muted-text)' }}>
            Don't have an account?{' '}
            <a href="/auth/signup" className="font-medium transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
