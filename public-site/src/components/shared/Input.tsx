import React from 'react';
import { Input as UIInput } from '../ui/input';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input: React.FC<InputProps> = (props) => {
  return <UIInput {...props} />;
};
