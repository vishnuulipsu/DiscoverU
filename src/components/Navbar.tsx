'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Globe, Shield, UserCheck, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentLanguage?: 'en' | 'hi' | 'kn';
  onLanguageChange?: (lang: 'en' | 'hi' | 'kn') => void;
}

export function Navbar({ currentLanguage = 'en', onLanguageChange }: NavbarProps) {
  const pathname = usePathname();

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
              <span className="text-xl font-bold tracking-tight text-[var(--ulipsu-indigo)]">
                DiscoverU
              </span>
            </div>
            <p className="text-[11px] font-semibold text-gray-500 tracking-wide mt-1 leading-none">
              Future of Work &amp; Enterprise Productivity
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
          <Link
            href="/recruiter"
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/recruiter')
                ? 'bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] font-semibold'
                : 'text-gray-700 hover:text-[var(--ulipsu-indigo)] hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Recruiter Suite
          </Link>
          <Link
            href="/candidate"
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/candidate')
                ? 'bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] font-semibold'
                : 'text-gray-700 hover:text-[var(--ulipsu-indigo)] hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[var(--ulipsu-amber)]" />
            Candidate Growth
          </Link>
          <Link
            href="/admin"
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/admin')
                ? 'bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)] font-semibold'
                : 'text-gray-700 hover:text-[var(--ulipsu-indigo)] hover:bg-gray-100'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            Admin Prompts
          </Link>
        </nav>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>
    </header>
  );
}
