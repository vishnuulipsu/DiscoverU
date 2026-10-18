'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  ArrowRight, 
  Globe, 
  CheckCircle2, 
  Database,
  BarChart3,
  Compass,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [lang, setLang] = useState<'en' | 'hi' | 'kn'>('en');
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedStatus('Seeding database with sample scenarios, prompts & users...');
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setSeedStatus(`Database seeded successfully! (${data.assessments} scenarios, ${data.prompts} prompts)`);
      } else {
        setSeedStatus(`Seed message: ${data.message || 'Already seeded or memory fallback active'}`);
      }
    } catch {
      setSeedStatus('Database seeded or working with in-memory fallback datasets.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FD]">
      <Navbar currentLanguage={lang} onLanguageChange={setLang} />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-10 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100 bg-gradient-to-b from-white via-indigo-50/30 to-[#F8F9FD]">
          <div className="max-w-6xl mx-auto text-center relative z-10">
            
            {/* DiscoverU-style pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--ulipsu-amber-light)] text-[var(--ulipsu-amber-hover)] text-xs sm:text-sm font-bold mb-6 border border-[var(--ulipsu-amber)]/30 shadow-xs">
              <Sparkles className="w-4 h-4 text-[var(--ulipsu-amber)]" />
              <span>Make Your Next Move Count</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-[var(--ulipsu-indigo)] tracking-tight leading-tight max-w-4xl mx-auto">
              Dual-Perspective Evaluations Powered by <span className="text-[var(--ulipsu-amber)] underline decoration decoration-2">Adaptive AI Intelligence</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Assess situational judgment with our innovative <strong className="text-[var(--ulipsu-indigo)]">Dual-Pane interface</strong> (MCQ + Structured Rationale) across 
              <span className="font-semibold text-gray-800"> English, हिन्दी, & ಕನ್ನಡ</span>. Deliver 
              objective diagnostic reports for Recruiters and empowering development roadmaps for Candidates.
            </p>

            {/* Quick Action CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/assessment"
                className="px-6 py-3.5 rounded-xl bg-[var(--ulipsu-indigo)] text-white font-semibold text-base shadow-lg shadow-indigo-900/20 hover:bg-[var(--ulipsu-indigo-hover)] hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-[var(--ulipsu-amber)]" />
                <span>Take Candidate Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                  href="/recruiter"
                  aria-disabled="true"
                  tabIndex={-1}
                  onClick={(e) => e.preventDefault()}
                  className="pointer-events-none opacity-50 px-6 py-3.5 rounded-xl bg-white text-[var(--ulipsu-indigo)] font-semibold text-base border-2 border-[var(--ulipsu-indigo)] flex items-center gap-2 shadow-xs cursor-not-allowed"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>View Recruiter Suite</span>
                </Link>

                <Link
                  href="/candidate"
                  aria-disabled="true"
                  tabIndex={-1}
                  onClick={(e) => e.preventDefault()}
                  className="pointer-events-none opacity-50 px-6 py-3.5 rounded-xl bg-[var(--ulipsu-amber)] text-white font-semibold text-base flex items-center gap-2 shadow-md cursor-not-allowed"
                >
                  <Award className="w-5 h-5" />
                  <span>Candidate Growth Report</span>
                </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid (3 Core Workspaces, Admin Removed) */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Three Interconnected Modules
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
              From taking multilingual assessments to dual feedback reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Dual-Pane Test */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[var(--ulipsu-indigo)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ulipsu-indigo)] bg-indigo-50 px-2 py-0.5 rounded">
                    Candidate Test
                  </span>
                  <span className="text-xs text-gray-400">3 Languages</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Dual-Pane Assessment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Candidates answer realistic organizational dilemmas with MCQ decision on the left and their reasoning rationale written on the right.
                </p>
                <ul className="text-xs text-gray-500 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    English, हिन्दी, and ಕನ್ನಡ
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Real-time timer & question progress
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Grounded evaluation trigger
                  </li>
                </ul>
              </div>
              <Link
                href="/assessment"
                className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] transition flex items-center justify-center gap-2"
              >
                <span>Launch Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Recruiter Suite (DISABLED BUTTON) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-[var(--ulipsu-amber-hover)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--ulipsu-amber-hover)] bg-amber-50 px-2 py-0.5 rounded">
                    Recruiter View
                  </span>
                  <span className="text-xs text-emerald-600 font-medium">6 Modules</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Recruiter Evaluation Suite
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Full implementation of the Recruiter Blueprint with strict separation of Candidate Facts vs. AI Interpretations to eliminate bias.
                </p>
                <ul className="text-xs text-gray-500 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Role-Fit Summary & Competencies
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Candidate Facts vs. AI Inferences
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Decision Support & Fairness Guardrails
                  </li>
                </ul>
              </div>
              <Link
                href="/recruiter"
                aria-disabled="true"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                className="pointer-events-none opacity-50 w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold bg-gray-900 text-white flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <span>Recruiter Report</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 3: Candidate Growth Suite (DISABLED BUTTON) */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Candidate Growth
                  </span>
                  <span className="text-xs text-indigo-600 font-medium">5 Core Sections</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Growth & Development Report
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Constructive feedback report featuring 5 core sections: Personality profile continuum, Potential strengths, Blind spots & challenges, Work preferences, and a 30-day action plan.
                </p>
                <ul className="text-xs text-gray-500 space-y-1.5 mb-6">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Personality Profile Continua
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Evidence-Based Potential Strengths
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    30-Day Practical Action Roadmap
                  </li>
                </ul>
              </div>
              <Link
                href="/candidate"
                aria-disabled="true"
                tabIndex={-1}
                onClick={(e) => e.preventDefault()}
                className="pointer-events-none opacity-50 w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold bg-[var(--ulipsu-amber)] text-white flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <span>Growth View</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Multilingual & Color Theme Showcase */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid  items-center">
           

              <div className="lg:col-span-2 bg-[#F8F9FD] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[var(--ulipsu-indigo)]" />
                    <span className="text-sm font-bold text-gray-900">
                      Live Indic Language Demonstration
                    </span>
                  </div>
                  <div className="flex gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setLang('en')}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                        lang === 'en' ? 'bg-[var(--ulipsu-indigo)] text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLang('hi')}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                        lang === 'hi' ? 'bg-[var(--ulipsu-indigo)] text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      onClick={() => setLang('kn')}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition ${
                        lang === 'kn' ? 'bg-[var(--ulipsu-indigo)] text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-xs">
                  {lang === 'en' && (
                    <div>
                      <p className="text-xs font-bold text-[var(--ulipsu-indigo)] uppercase mb-1">
                        Scenario 1: Team Deadline vs Quality Tradeoff
                      </p>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        Your engineering team discovers a subtle edge-case bug 12 hours before a major enterprise client launch. What action do you take?
                      </h4>
                      <p className="text-xs text-gray-500">
                        Dual-pane split: MCQ decision with immediate rationale input on the right.
                      </p>
                    </div>
                  )}

                  {lang === 'hi' && (
                    <div>
                      <p className="text-xs font-bold text-[var(--ulipsu-indigo)] uppercase mb-1">
                        परिदृश्य १: समय-सीमा बनाम गुणवत्ता संतुलन
                      </p>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        मुख्य उद्यम क्लाइंट लॉन्च से १२ घंटे पहले आपकी इंजीनियरिंग टीम को एक बग का पता चलता है। आप क्या कदम उठाएंगे?
                      </h4>
                      <p className="text-xs text-gray-500">
                        दोहरा फलक: बायीं ओर बहुविकल्पीय चयन और दायीं ओर आपका विस्तृत लिखित तर्क।
                      </p>
                    </div>
                  )}

                  {lang === 'kn' && (
                    <div>
                      <p className="text-xs font-bold text-[var(--ulipsu-indigo)] uppercase mb-1">
                        ಸನ್ನಿವೇಶ ೧: ಗಡುವು ಮತ್ತು ಗುಣಮಟ್ಟದ ಸಮತೋಲನ
                      </p>
                      <h4 className="text-base font-semibold text-gray-900 mb-2">
                        ಪ್ರಮುಖ ಎಂಟರ್‌ಪ್ರೈಸ್ ಗ್ರಾಹಕರ ಬಿಡುಗಡೆಗೆ 12 ಗಂಟೆಗಳ ಮೊದಲು ನಿಮ್ಮ ಎಂಜಿನಿಯರಿಂಗ್ ತಂಡವು ದೋಷವನ್ನು ಪತ್ತೆ ಮಾಡುತ್ತದೆ. ನೀವು ಯಾವ ಕ್ರಮ ಕೈಗೊಳ್ಳುತ್ತೀರಿ?
                      </h4>
                      <p className="text-xs text-gray-500">
                        ದ್ವಿಮುಖ ಫಲಕ: ಎಡಭಾಗದಲ್ಲಿ ಬಹುಆಯ್ಕೆ ಆಯ್ಕೆ ಮತ್ತು ಬಲಭಾಗದಲ್ಲಿ ನಿಮ್ಮ ಲಿಖಿತ ವಿವರಣೆ.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
