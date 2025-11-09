import { ButtonHTMLAttributes } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function PrimaryButton({ children, className = '', ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`relative bg-gradient-to-r from-[#8B95A5] via-[#A8B2C1] to-[#8B95A5] text-[#0A0A0A] px-8 py-4 rounded-lg font-semibold uppercase transition-all hover:from-[#A8B2C1] hover:via-[#E5E9ED] hover:to-[#A8B2C1] shadow-[0px_4px_20px_rgba(139,149,165,0.3)] hover:shadow-[0px_6px_24px_rgba(168,178,193,0.5)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}