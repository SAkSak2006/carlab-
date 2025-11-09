import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`bg-[#D4F347] text-[#0A0E1A] px-8 py-4 rounded-lg font-semibold uppercase transition-all hover:bg-[#e0f75e] shadow-[0px_4px_20px_rgba(212,243,71,0.3)] hover:shadow-[0px_6px_24px_rgba(212,243,71,0.4)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
