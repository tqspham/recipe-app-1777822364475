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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-[0.75rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mb-6 text-gray-600">Sign up to start sharing recipes</p>

          {error && (
            <div className="mb-6 rounded-[0.75rem] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[0.5rem] border border-gray-200 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  placeholder="you@example.com"
                  required
                  aria-label="Email address"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full rounded-[0.5rem] border border-gray-200 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  placeholder="Enter a strong password"
                  required
                  aria-label="Password"
                  disabled={isLoading}
                />
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-600">Password must contain:</p>
                  <ul className="space-y-1">
                    {passwordStrengthErrors.length > 0 ? (
                      passwordStrengthErrors.map((error) => (
                        <li key={error} className="text-xs text-red-600">
                          ✗ {error}
                        </li>
                      ))
                    ) : (
                      <li className="text-xs text-green-600">✓ All requirements met</li>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-[0.5rem] border border-gray-200 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                  aria-label="Confirm password"
                  disabled={isLoading}
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !email}
              className="w-full rounded-[0.5rem] bg-blue-600 px-4 py-2 text-white font-medium transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              aria-label="Create account"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/auth/login" className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
