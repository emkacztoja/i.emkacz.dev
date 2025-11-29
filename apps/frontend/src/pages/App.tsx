// @ts-nocheck
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { ShortenForm } from '../features/shortener/ShortenForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './Admin/Login';
import AdminUrls from './Admin/Urls';
import { Github as GitHubIcon, Linkedin as LinkedInIcon, Mail, Globe, Zap } from 'lucide-react';

const queryClient = new QueryClient();

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check system preference on mount
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={theme}>
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
          {/* Gradient Background Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <BrowserRouter>
            <div className="relative z-10 flex flex-col min-h-screen">
              <div className="w-full max-w-4xl mx-auto px-6 py-12 flex-1">
                {/* Header */}
                <header className="flex items-start justify-between mb-12 animate-fade-in">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <Zap className="w-8 h-8 text-primary" />
                      <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        i.emkacz.dev
                      </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-md">
                      Lightning-fast URL shortener with a beautiful interface.
                      Secure, elegant, and built for speed.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                  </div>
                </header>

                {/* Main Content */}
                <main className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="glass rounded-2xl p-8 shadow-2xl border-2">
                    <ShortenForm />
                  </div>

                  <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminUrls />} />
                  </Routes>
                </main>

                {/* Features Section */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-4">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">Lightning Fast</h3>
                    <p className="text-sm text-muted-foreground">
                      Optimized for speed with instant URL generation and redirects.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">Custom Aliases</h3>
                    <p className="text-sm text-muted-foreground">
                      Create memorable short links with your own custom aliases.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2">QR Codes</h3>
                    <p className="text-sm text-muted-foreground">
                      Every short link comes with a scannable QR code.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="mt-auto py-8 border-t border-border/50">
                <div className="w-full max-w-4xl mx-auto px-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Built with ❤️ by <span className="font-semibold text-foreground">Aleksander Kowalczuk</span>
                    </p>
                    <div className="flex items-center gap-4">
                      <a
                        href="https://github.com/emkacztoja"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <GitHubIcon className="w-4 h-4" />
                        <span className="hidden md:inline">GitHub</span>
                      </a>
                      <a
                        href="https://linkedin.com/in/aleksander-kowalczuk"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <LinkedInIcon className="w-4 h-4" />
                        <span className="hidden md:inline">LinkedIn</span>
                      </a>
                      <a
                        href="https://emkacz.pl"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="hidden md:inline">Website</span>
                      </a>
                      <a
                        href="mailto:akowalczuk@emkacz.pl"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="hidden md:inline">Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </QueryClientProvider>
  );
}





