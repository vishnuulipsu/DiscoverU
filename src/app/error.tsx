'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Copy, Check } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to console / error reporting service
    console.error('Captured Application Error:', error);
  }, [error]);

  const handleCopy = () => {
    const errorDetails = `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nStack: ${error.stack || 'N/A'}`;
    navigator.clipboard.writeText(errorDetails).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#131C31] border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">Application Error</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Something went wrong</h1>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            An unexpected error occurred while processing your request. Any active assessment drafts stored in your browser remain preserved.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button
              onClick={() => reset()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-md active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-200 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go to Assessment
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-200 font-medium text-sm transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
          </div>

          {/* Collapsible Error Diagnostics */}
          <div className="border border-slate-800 rounded-xl bg-[#0B1120] p-4 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-400">Technical Diagnostics</span>
              <button
                onClick={handleCopy}
                className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy info'}</span>
              </button>
            </div>
            <p className="text-rose-400 font-mono break-words mb-1">
              {error.message || 'Unknown runtime error'}
            </p>
            {error.digest && (
              <p className="text-slate-500 font-mono text-[11px]">
                Digest: {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
