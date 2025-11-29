import { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass';
};

export const Card = ({ children, className, variant = 'default' }: Props) => (
  <div
    className={clsx(
      'rounded-xl shadow-lg transition-all duration-200',
      variant === 'default' && 'border-2 border-border bg-card',
      variant === 'glass' && 'glass',
      className
    )}
  >
    {children}
  </div>
);



