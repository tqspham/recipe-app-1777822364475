"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Mail, User as UserIcon } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setError('Failed to validate authentication');
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (err) {
      setError('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-pulse rounded-[0.5rem] border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium text-gray-600 transition-colors duration-200 hover:text-gray-900">
              Favorites
            </a>
            <a href="/profile" className="text-lg font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700">
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-[0.75rem] border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">My Profile</h1>

          {error && (
            <div className="mb-6 rounded-[0.75rem] border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-[0.75rem] bg-blue-100">
                <UserIcon size={40} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">User Account</h2>
                <p className="text-gray-600 mt-1">Manage your recipe collection and preferences</p>
              </div>
            </div>

            {/* Account Details */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Details</h3>
              <div className="space-y-4">
                <div className="rounded-[0.5rem] bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email Address</p>
                      <p className="text-gray-900 font-semibold">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[0.5rem] bg-gray-50 p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <UserIcon size={20} className="text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">User ID</p>
                      <p className="text-gray-900 font-semibold text-sm break-all">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Account Actions</h3>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-[0.5rem] bg-red-600 px-6 py-3 text-white font-medium transition-all duration-200 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:outline-2 focus:outline-red-500"
                aria-label="Log out of your account"
              >
                <LogOut size={20} />
                <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
