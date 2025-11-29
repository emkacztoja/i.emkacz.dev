import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ThemeToggle } from '../components/ThemeToggle';
import { Home, RefreshCw, Search } from 'lucide-react';

const messages = [
  "404 - This page went out for coffee and never came back.",
  "404 - The hamsters powering this page have escaped.",
  "404 - You found a page that didn't want to be found.",
  "404 - Oops! We misplaced that page between the couch cushions.",
  "404 - This page is on vacation. Please try later.",
  "404 - The developer swears this route existed yesterday.",
  "404 - Alien interference detected. Page lost in space.",
  "404 - Page not found. But here's a compliment: nice browser.",
  "404 - The internet took a detour. This page didn't get the memo.",
  "404 - Surprise! Not the page you expected. Try again?",
  "404 - The page is hiding. Seek harder, young padawan.",
  "404 - Our code monkeys are still looking for that one.",
  "404 - The page evaporated in a puff of logic error.",
  "404 - This page decided to join a witness protection program.",
  "404 - You've reached the end of the internet. Turn back!",
  "404 - Someone forgot to feed the server gremlins again.",
  "404 - This page took the red pill and left the simulation.",
  "404 - Page not found, but the vibes are immaculate.",
  "404 - We looked everywhere... even under the stack trace.",
  "404 - The page drifted off into the cloud.",
  "404 - Plot twist: there was never a page here.",
  "404 - This page was last seen heading toward /dev/null.",
  "404 - Page not found. It must have been garbage collected.",
  "404 - Our AI misplaced this page. It's learning… slowly.",
  "404 - This page got replaced by an NFT. Sorry!"
];

export default function NotFound() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  useEffect(() => {
    setMessage(getRandomMessage());
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  const handleNewMessage = () => {
    setIsRotating(true);
    setTimeout(() => {
      setMessage(getRandomMessage());
      setIsRotating(false);
    }, 200);
  };

  return (
    <div className={theme}>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex items-center justify-center">
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
        </div>

        {/* Gradient Background Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center animate-fade-in">
          {/* 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4">
              404
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Search className="w-6 h-6 text-muted-foreground" />
              <p className="text-2xl font-bold text-foreground">
                Page Not Found
              </p>
            </div>
          </div>

          {/* Random Message */}
          <div className="glass rounded-2xl p-8 shadow-2xl border-2 mb-8">
            <p
              className={`text-xl text-muted-foreground transition-all duration-200 ${
                isRotating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 min-w-[200px]"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Button>

            <Button
              onClick={handleNewMessage}
              variant="outline"
              className="flex items-center gap-2 min-w-[200px]"
              disabled={isRotating}
            >
              <RefreshCw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
              Try Another Message
            </Button>
          </div>

          {/* Fun ASCII Art */}
          <div className="mt-12 text-muted-foreground font-mono text-sm opacity-50">
            <pre className="inline-block text-left">
{`    ¯\\_(ツ)_/¯
  404 happens`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

