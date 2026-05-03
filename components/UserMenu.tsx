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
        className="inline-flex items-center gap-2 rounded-[0.5rem] bg-blue-600 px-4 py-2 text-sm text-white font-medium transition-all duration-200 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md"
      >
        Log In
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-[0.5rem] border border-gray-300 bg-white px-3 py-2 text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:bg-gray-100 focus:outline-2 focus:outline-blue-500"
        aria-label="View your profile"
        title="View your profile"
      >
        <User size={18} />
        <span className="hidden sm:inline max-w-[200px] truncate text-sm font-medium">{user.email}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-[0.5rem] border border-gray-200 bg-white shadow-lg">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Signed in as</p>
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              router.push('/profile');
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:outline-2 focus:outline-blue-500"
            aria-label="Go to your profile"
          >
            <User size={18} />
            <span>View Profile</span>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-gray-700 transition-colors duration-200 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-2 focus:outline-blue-500"
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
