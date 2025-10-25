'use client';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  animationDelay?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    icon: 'text-primary-600',
    gradient: 'from-primary-500 to-primary-700',
  },
  success: {
    bg: 'bg-green-50',
    text: 'text-green-900',
    icon: 'text-green-600',
    gradient: 'from-green-500 to-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-900',
    icon: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-700',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-900',
    icon: 'text-red-600',
    gradient: 'from-red-500 to-red-700',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-700',
  },
};

export default function StatsCard({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  animationDelay = 0,
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <div 
      className="card hover-lift group animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className={`text-3xl font-bold ${colors.text} transition-smooth group-hover:scale-105`}>
              {value}
            </p>
            
            {trend && (
              <div className="mt-2 flex items-center gap-1">
                <svg 
                  className={`w-4 h-4 ${trend.isPositive ? 'text-green-600 rotate-0' : 'text-red-600 rotate-180'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend.value)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            )}
          </div>
          
          <div className={`${colors.bg} p-3 rounded-lg transition-smooth group-hover:scale-110 group-hover:shadow-glow`}>
            <div className={colors.icon}>
              {icon}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient bar at bottom */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-smooth rounded-b-xl`} />
    </div>
  );
}
