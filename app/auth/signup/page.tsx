"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrengthErrors, setPasswordStrengthErrors] = useState<string[]>([]);

  const handlePasswordChange = (value: string) => {
    setPassword(value);

    const errors: string[] = [];
    if (value.length < 8) {
      errors.push('At least 8 characters');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('One uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('One lowercase letter');
    }
    if (!/\d/.test(value)) {
      errors.push('One number');
    }

    setPasswordStrengthErrors(errors);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = passwordStrengthErrors.length === 0 && password.length > 0;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="w-full max-w-md">
        <div className="rounded-[14px] border-2 p-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h1 className="mb-2 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Create Account</h1>
          <p className="mb-6" style={{ color: 'var(--color-muted-text)' }}>Sign up to start sharing recipes</p>

          {error && (
            <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
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
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full rounded-[8px] border-2 py-2 pl-10 pr-3 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="Enter a strong password"
                  required
                  aria-label="Password"
                  disabled={isLoading}
                />
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--color-muted-text)' }}>Password must contain:</p>
                  <ul className="space-y-1">
                    {passwordStrengthErrors.length > 0 ? (
                      passwordStrengthErrors.map((error) => (
                        <li key={error} className="text-xs" style={{ color: 'var(--color-danger)' }}>
                          ✗ {error}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs" style={{ color: 'var(--color-success)' }}>✓ All requirements met</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                Confirm Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2" size={20} style={{ color: 'var(--color-muted-text)' }} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-[8px] border-2 py-2 pl-10 pr-3 transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder="Confirm your password"
                  required
                  aria-label="Confirm password"
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs" style={{ color: 'var(--color-danger)' }}>Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !email}
              className="w-full rounded-[10px] px-4 py-2 text-white font-medium transition-all duration-200 shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                backgroundColor: isLoading || !isPasswordValid || !email ? 'var(--color-muted-text)' : 'var(--color-primary)',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && isPasswordValid && email) {
                  e.currentTarget.style.backgroundColor = '#8B5A3F';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && isPasswordValid && email) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }
              }}
              aria-label="Create account"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-muted-text)' }}>
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
