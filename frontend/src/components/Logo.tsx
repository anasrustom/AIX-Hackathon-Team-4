import Image from 'next/image';
import LogoSVG from '@/assets/logo.svg';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl',
  };

  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 56, height: 56 },
    xl: { width: 80, height: 80 },
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
        <Image 
          src={LogoSVG} 
          alt="Klara Logo" 
          width={iconSizes[size].width} 
          height={iconSizes[size].height}
          className="object-contain"
          priority
        />
      </div>
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent`}>
        Klara
      </span>
    </div>
  );
}
