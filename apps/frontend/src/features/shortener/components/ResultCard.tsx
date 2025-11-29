import { Button } from '../../../components/Button';
import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

type Props = {
  shortUrl: string;
};

export const ResultCard = ({ shortUrl }: Props) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shortUrl
  )}`;

  return (
    <div className="space-y-6 rounded-xl glass p-6 shadow-xl animate-scale-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Your shortened URL is ready! 🎉
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
          <a
            className="flex-1 text-primary hover:text-primary/80 transition-colors font-medium truncate"
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortUrl}
          </a>
          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </div>

        <Button
          type="button"
          onClick={copy}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to clipboard
            </>
          )}
        </Button>
      </div>

      <div className="pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground mb-4 text-center font-medium">
          Scan QR Code
        </p>
        <div className="flex justify-center p-4 bg-white rounded-lg shadow-inner">
          <img
            src={qrSrc}
            alt="QR code"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};


