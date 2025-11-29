import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className, ...props }: Props) => (
  <input
    className={clsx(
      'w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-sm',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
      'placeholder:text-muted-foreground',
      'hover:border-primary/50',
      className
    )}
    {...props}
  />
);



