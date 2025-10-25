'use client';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const alertStyles = {
  success: {
    container: 'bg-green-50 border-green-500',
    icon: 'text-green-600',
    title: 'text-green-900',
    message: 'text-green-800',
  },
  error: {
    container: 'bg-red-50 border-red-500',
    icon: 'text-red-600',
    title: 'text-red-900',
    message: 'text-red-800',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-500',
    icon: 'text-yellow-600',
    title: 'text-yellow-900',
    message: 'text-yellow-800',
  },
  info: {
    container: 'bg-blue-50 border-blue-500',
    icon: 'text-blue-600',
    title: 'text-blue-900',
    message: 'text-blue-800',
  },
};

const icons = {
  success: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function Alert({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  className = '' 
}: AlertProps) {
  const styles = alertStyles[type];

  return (
    <div className={`border-l-4 rounded-lg p-4 animate-fade-in ${styles.container} ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-semibold mb-1 ${styles.title}`}>
              {title}
            </h3>
          )}
          <p className={`text-sm ${styles.message}`}>
            {message}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`flex-shrink-0 ${styles.icon} hover:opacity-75 transition-smooth`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
