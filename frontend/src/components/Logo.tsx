export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const spacing = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-3',
    xl: 'gap-4',
  };

  return (
    <div className={`flex items-center ${spacing[size]} transition-smooth hover:scale-105`}>
      <div className="relative">
        <svg className={`${iconSizes[size]} text-primary-600`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent`}>
        Klara
      </span>
    </div>
  );
}
