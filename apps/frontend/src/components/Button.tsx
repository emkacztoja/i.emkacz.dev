import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'secondary' | 'outline';
};

export const Button = ({ className, variant = 'primary', disabled, ...props }: Props) => (
  <button
    className={clsx(
      'rounded-lg px-6 py-3 font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      variant === 'primary' &&
        'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl',
      variant === 'secondary' &&
        'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      variant === 'ghost' &&
        'text-foreground hover:bg-muted/50',
      variant === 'outline' &&
        'border-2 border-border text-foreground hover:bg-muted/50 hover:border-primary/50',
      className
    )}
    disabled={disabled}
    {...props}
  />
);



