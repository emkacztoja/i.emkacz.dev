// @ts-nocheck
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ShortenForm } from '../features/shortener/ShortenForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminLogin from './Admin/Login';
import AdminUrls from './Admin/Urls';

const queryClient = new QueryClient();

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <QueryClientProvider client={queryClient}>
      <div className={theme}>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <BrowserRouter>
            <div className="w-full max-w-2xl p-6">
              <header className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold tracking-tight">i.emkacz.dev</h1>
                  <p className="text-sm text-muted-foreground">Tiny, elegant URL shortener — secure by design.</p>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
                </div>
              </header>

              <main>
                <div className="bg-card shadow-md rounded-lg p-6">
                  <ShortenForm />
                </div>

                <Routes>
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminUrls />} />
                </Routes>
              </main>

              <footer className="mt-8 text-center text-sm text-muted-foreground">
                <div className="mb-2">Connect</div>
                <div className="flex items-center justify-center gap-4">
                  <a href="https://github.com/emkacztoja" target="_blank" rel="noreferrer" className="underline">GitHub</a>
                  <a href="https://linkeding.com/in/aleksander-kowalczuk" target="_blank" rel="noreferrer" className="underline">LinkedIn</a>
                  <a href="https://emkacz.pl" target="_blank" rel="noreferrer" className="underline">Website</a>
                  <a href="mailto:akowalczuk@emkacz.pl" className="underline">Email</a>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </div>
      </div>
    </QueryClientProvider>
  );
}
