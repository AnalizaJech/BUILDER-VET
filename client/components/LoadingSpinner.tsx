import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Cargando...', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]} mb-2`} />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

export function LoadingCard({ children, isLoading, className = '' }: { 
  children: React.ReactNode; 
  isLoading: boolean; 
  className?: string; 
}) {
  if (isLoading) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <LoadingSpinner size="sm" text="" />
        </div>
        <div className="opacity-50">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function LoadingPage({ text = 'Cargando datos...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}
