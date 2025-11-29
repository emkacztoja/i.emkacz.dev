// @ts-nocheck
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { shortenUrl } from '../../lib/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ResultCard } from './components/ResultCard';
import { Link, Hash, Calendar, AlertCircle, Sparkles } from 'lucide-react';

const formSchema = z.object({
  originalUrl: z.string().url('Enter a valid URL'),
  customAlias: z.string().optional(),
  expireDays: z.number().int().nonnegative().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const ShortenForm = () => {
  const [values, setValues] = useState<FormValues>({ originalUrl: '', customAlias: '', expireDays: 7 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: shortenUrl,
    onError: (err: any) => {
      // Handle structured errors thrown from API client
      if (err && typeof err === 'object' && 'status' in err) {
        if (err.status === 400 && err.data?.errors) {
          setErrorMessage(err.data.errors.map((e: any) => e.message).join(', '));
          return;
        }
        if (err.status === 409) {
          setErrorMessage(err.data?.message ?? 'Conflict');
          return;
        }
      }
      setErrorMessage('An unexpected error occurred.');
    },
    onSuccess: () => setErrorMessage(null),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setErrorMessage(parsed.error.errors[0].message);
      return;
    }
    // Omit customAlias when it's empty so backend will generate a nanoid
    const payload: any = { ...parsed.data };
    if (payload.customAlias === '' || (typeof payload.customAlias === 'string' && payload.customAlias.trim() === '')) {
      delete payload.customAlias;
    }
    // if expireDays is 0 or undefined, omit it to mean permanent
    if (!payload.expireDays) delete payload.expireDays;
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Link className="w-4 h-4 text-primary" />
            Enter your long URL
          </label>
          <Input
            placeholder="https://example.com/very/long/url/that/needs/shortening"
            value={values.originalUrl}
            onChange={(e) => setValues({ ...values, originalUrl: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Hash className="w-4 h-4 text-primary" />
            Custom alias (optional)
          </label>
          <Input
            placeholder="my-custom-link"
            value={values.customAlias ?? ''}
            onChange={(e) => setValues({ ...values, customAlias: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty for an auto-generated short code
          </p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            Link expiration
          </label>
          <select
            className="w-full rounded-lg border-2 border-border bg-background px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50"
            value={values.expireDays ?? 7}
            onChange={(e) => setValues({ ...values, expireDays: Number(e.target.value) })}
          >
            <option value={1}>1 day</option>
            <option value={3}>3 days</option>
            <option value={7}>7 days (recommended)</option>
          </select>
        </div>

        <Button
          className="w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate short link
            </>
          )}
        </Button>
      </form>

      {mutation.isSuccess && <ResultCard shortUrl={mutation.data.shortUrl} />}
    </div>
  );
};


