import { Moon, Sun } from 'lucide-react';

type Props = {
  theme: 'light' | 'dark';
  onToggle: () => void;
};

export const ThemeToggle = ({ theme, onToggle }: Props) => (
  <button
    className="relative rounded-lg border-2 border-border p-2.5 hover:border-primary/50 transition-all duration-200 hover:bg-muted/50 group"
    onClick={onToggle}
    aria-label="Toggle theme"
  >
    {theme === 'light' ? (
      <Moon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
    ) : (
      <Sun className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
    )}
  </button>
);



