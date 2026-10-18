import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, BookOpen, UserCheck, Shield, Globe, Award, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-[var(--ulipsu-border)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white border border-[var(--ulipsu-border)] flex items-center justify-center shadow-xs p-1">
                <Image
                  src="/logo-icon.png"
                  alt="DiscoverU Icon"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-[var(--ulipsu-indigo)] block">
                  DiscoverU
                </span>
                <span className="text-[10px] text-[var(--ulipsu-amber-hover)] font-bold uppercase tracking-wider block">
                  Future of Work
                </span>
              </div>
            </Link>
            <p className="text-xs text-[var(--ulipsu-muted)] leading-relaxed">
              AI Powered Behavioral & Situational Assessment Platform for Enterprise Productivity. Evidence-grounded evaluation for hiring teams and constructive development for candidates.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--ulipsu-amber-light)] text-[var(--ulipsu-amber-hover)] text-[11px] font-semibold border border-[var(--ulipsu-amber)]/20">
              <Sparkles className="w-3 h-3 text-[var(--ulipsu-amber)]" />
              <span>AI Powered Enterprise Intelligence</span>
            </div>
          </div>

          {/* Platform Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Platform Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/assessment"
                  className="text-gray-600 hover:text-[var(--ulipsu-indigo)] transition flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                  <span>Candidate Assessment Test</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/recruiter"
                  className="text-gray-600 hover:text-[var(--ulipsu-indigo)] transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span>Recruiter Evaluation Suite</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/candidate"
                  className="text-gray-600 hover:text-[var(--ulipsu-indigo)] transition flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-gray-400" />
                  <span>Candidate Growth & Self-Discovery</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-[var(--ulipsu-indigo)] transition flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span>Admin Prompt Studio</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Multilingual Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Supported Languages
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--ulipsu-indigo)]" />
                <span>English (Global Assessment)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-bold">हि</span>
                <span>हिन्दी (Hindi Localization)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center text-[10px] font-bold">ಕ</span>
                <span>ಕನ್ನಡ (Kannada Localization)</span>
              </li>
            </ul>
            <p className="text-[11px] text-gray-400 mt-2.5">
              Zero score penalty for language switches or simplification queries.
            </p>
          </div>

          {/* Standards & Philosophy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-3">
              Design & Ethics
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              Built with the vivid, playful color theme of <strong>Ulipsu</strong> with ethical AI guardrails: separating raw candidate facts from AI interpretations.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500">
              <span>Next.js 16</span>
              <span>•</span>
              <span>MongoDB</span>
              <span>•</span>
              <span>AI Powered</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            © {new Date().getFullYear()} DiscoverU - Future of Work & Enterprise Productivity. Built with Ulipsu aesthetic.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[var(--ulipsu-indigo)] transition">
              Home
            </Link>
            <Link href="/assessment" className="hover:text-[var(--ulipsu-indigo)] transition">
              Assessment
            </Link>
            <Link href="/recruiter" className="hover:text-[var(--ulipsu-indigo)] transition">
              Recruiter
            </Link>
            <Link href="/candidate" className="hover:text-[var(--ulipsu-indigo)] transition">
              Growth Report
            </Link>
            <Link href="/admin" className="hover:text-[var(--ulipsu-indigo)] transition">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
