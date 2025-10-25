'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      name: t('nav.dashboard'),
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: t('nav.upload'),
      href: '/upload',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      name: t('nav.contracts'),
      href: '/contracts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-2 rtl:space-x-reverse">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center gap-2 px-4 py-4 text-sm font-medium transition-smooth
                  border-b-2 relative overflow-hidden
                  ${isActive 
                    ? 'border-primary-900 text-primary-900' 
                    : 'border-transparent text-gray-600 hover:text-primary-900 hover:border-gray-300'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className={`transition-smooth ${isActive ? 'text-primary-900' : 'text-gray-400 group-hover:text-primary-900'}`}>
                  {item.icon}
                </span>
                {item.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary animate-slide-in-left" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
