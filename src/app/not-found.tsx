import React from 'react';
import Link from 'next/link';
import { Compass, Home, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#131C31] border border-slate-800 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto mb-5 text-sky-400">
          <Compass className="w-8 h-8" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-3">
          404 • Page Not Found
        </span>

        <h1 className="text-2xl font-bold text-white mb-2">Resource Not Found</h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          The requested page, assessment session, or evaluation report could not be located. It may have expired or been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/assessment"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm transition-all shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            Start Assessment
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-slate-700 text-slate-200 font-medium text-sm transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
