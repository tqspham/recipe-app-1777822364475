"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
}

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/auth/login');
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!user) {
    return (
      <a
        href="/auth/login"
        className="inline-flex items-center gap-2 rounded-[10px] px-4 py-2 text-sm font-medium text-white transition-all duration-200 shadow-sm"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        Log In
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-[8px] border-2 px-3 py-2 transition-all duration-200"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          color: 'var(--color-text)',
        }}
        aria-label="View your profile"
        title="View your profile"
      >
        <User size={18} />
        <span className="hidden sm:inline max-w-[200px] truncate text-sm font-medium">{user.email}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-[10px] border-2 shadow-lg" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Signed in as</p>
            <p className="text-sm truncate" style={{ color: 'var(--color-muted-text)' }}>{user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push('/profile');
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors duration-200"
            style={{
              color: 'var(--color-text)',
            }}
            aria-label="Go to your profile"
          >
            <User size={18} />
            <span>View Profile</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 disabled:cursor-not-allowed"
            style={{
              color: isLoggingOut ? 'var(--color-muted-text)' : 'var(--color-text)',
            }}
            aria-label="Log out"
          >
            <LogOut size={18} />
            <span>{isLoggingOut ? 'Logging Out...' : 'Log Out'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
