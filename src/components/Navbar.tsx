'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentLanguage?: 'en' | 'hi' | 'kn';
  onLanguageChange?: (lang: 'en' | 'hi' | 'kn') => void;
  theme?: 'light' | 'dark';
}

export function Navbar({ currentLanguage = 'en', onLanguageChange, theme = 'light' }: NavbarProps) {
  const pathname = usePathname();
  const isDark = theme === 'dark';

  if (isDark) {
    return (
      <header className="sticky top-0 z-50 bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-800 shadow-sm text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 border border-indigo-400/30 flex items-center justify-center shadow-xs shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="text-base font-bold tracking-tight text-white">
                  Multilingual Assessment
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide mt-1 leading-none">
                Psychometric Assessment Platform
              </p>
            </div>
          </Link>

          {/* Engine Pill & Language & Nav */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E1065]/70 border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Hybrid AI + Local Matrix Engine</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline text-slate-400 text-[11px]">Language / ಭಾಷೆ / भाषा:</span>
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as 'en' | 'hi' | 'kn')}
                className="bg-transparent font-medium text-white focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-[#1E293B] text-white">🇬🇧 English</option>
                <option value="hi" className="bg-[#1E293B] text-white">🇮🇳 हिन्दी</option>
                <option value="kn" className="bg-[#1E293B] text-white">🇮🇳 ಕನ್ನಡ</option>
              </select>
            </div>

            <nav className="flex items-center gap-2 text-xs font-medium">
              <Link
                href="/assessment"
                className="text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition-colors"
              >
                Assessment
              </Link>
            </nav>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[var(--ulipsu-border)] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-[var(--ulipsu-border)] flex items-center justify-center shadow-xs group-hover:border-[var(--ulipsu-indigo)] transition-colors p-1 shrink-0">
            <Image
              src="/logo-icon.png"
              alt="DiscoverU Icon"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-2 leading-none">
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[var(--ulipsu-amber)]">Discover</span>
                <span className="text-[var(--ulipsu-indigo)]">U</span>
              </span>
            </div>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wide mt-1 leading-none">
              Make Your Next Move Count
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <Link
            href="/assessment"
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/assessment')
                ? 'bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] font-semibold'
                : 'text-gray-700 hover:text-[var(--ulipsu-indigo)] hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Candidate Test
          </Link>
        </nav>

        {/* Language Selector Dropdown */}
        {/* <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-[var(--ulipsu-border)] rounded-lg px-2.5 py-1.5 text-xs">
            <Globe className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
            <select
              value={currentLanguage}
              onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as 'en' | 'hi' | 'kn')}
              className="bg-transparent font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div> */}
      </div>
    </header>
  );
}
