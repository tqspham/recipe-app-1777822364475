"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await fetch('/api/auth/validate');
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            router.push('/auth/login');
          }
        } else {
          setIsAuthenticated(false);
          router.push('/auth/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/auth/login');
      }
    };

    validateAuth();
  }, [router]);

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block">
            <div className="h-12 w-12 animate-pulse rounded-[0.5rem] border-4 border-gray-200 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
