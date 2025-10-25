'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/components/Logo';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if not authenticated, otherwise to dashboard
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="text-center relative z-10 px-4">
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="animate-bounce-gentle">
              <Logo size="xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
            Klara
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Intelligent Contract Lifecycle Management
          </p>
          <p className="text-sm text-gray-500">
            Supporting English & Arabic • مدعوم بالعربية
          </p>
        </div>
        
        <div className="flex gap-2 animate-pulse">
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
