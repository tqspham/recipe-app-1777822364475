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
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div
              className="h-12 w-12 animate-pulse rounded-[8px] border-4"
              style={{
                borderColor: 'var(--color-background)',
                borderTopColor: 'var(--color-primary)',
              }}
            />
          </div>
          <p className="font-medium" style={{ color: 'var(--color-muted-text)' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false || !user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      <header className="sticky top-0 z-40 border-b shadow-sm" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="container mx-auto max-w-4xl px-4 py-4">
          <nav className="flex gap-4">
            <a href="/" className="text-lg font-medium transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
              Recipes
            </a>
            <a href="/favorites" className="text-lg font-medium transition-colors duration-200" style={{ color: 'var(--color-text)' }}>
              Favorites
            </a>
            <a href="/profile" className="text-lg font-medium" style={{ color: 'var(--color-primary)' }}>
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-[12px] border-2 p-8" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <h1 className="mb-8 text-3xl font-bold" style={{ color: 'var(--color-text)' }}>My Profile</h1>

          {error && (
            <div className="mb-6 rounded-[10px] border-2 p-4" style={{ backgroundColor: 'rgba(184, 92, 84, 0.05)', borderColor: 'var(--color-danger)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>
            </div>
          )}

          {/* Profile Information */}
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-[12px]" style={{ backgroundColor: 'var(--color-background)' }}>
                <UserIcon size={40} style={{ color: 'var(--color-primary)' }} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>User Account</h2>
                <p className="mt-1" style={{ color: 'var(--color-muted-text)' }}>Manage your recipe collection and preferences</p>
              </div>
            </div>

            {/* Account Details */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <h3 className="mb-4 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Account Details</h3>
              <div className="space-y-4">
                <div className="rounded-[8px] border-2 p-4" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <Mail size={20} style={{ color: 'var(--color-muted-text)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>Email Address</p>
                      <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[8px] border-2 p-4" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
                  <div className="flex items-center gap-3">
                    <UserIcon size={20} style={{ color: 'var(--color-muted-text)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-muted-text)' }}>User ID</p>
                      <p className="text-sm font-semibold break-all" style={{ color: 'var(--color-text)' }}>{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
              <h3 className="mb-4 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>Account Actions</h3>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-[10px] px-6 py-3 text-white font-medium transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--color-danger)' }}
                onMouseEnter={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = '#A34A42';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoggingOut) {
                    e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }
                }}
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
