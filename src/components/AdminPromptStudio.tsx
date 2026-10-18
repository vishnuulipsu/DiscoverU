'use client';

import React, { useState } from 'react';
import { IPromptTemplate } from '@/models/PromptTemplate';
import { IPromptVersion } from '@/models/PromptVersion';
import {
  Shield,
  Play,
  Save,
  RotateCcw,
  Sparkles,
  Sliders,
  Code,
  Terminal,
  History,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AdminPromptStudioProps {
  initialTemplates: IPromptTemplate[];
  initialVersions: IPromptVersion[];
}

export function AdminPromptStudio({ initialTemplates, initialVersions }: AdminPromptStudioProps) {
  const [templates] = useState<IPromptTemplate[]>(initialTemplates);
  const [versions, setVersions] = useState<IPromptVersion[]>(initialVersions);
  const [selectedSlug, setSelectedSlug] = useState<string>(
    initialTemplates[0]?.slug || 'recruiter_evaluation'
  );

  const activeVersion = versions.find((v) => v.templateSlug === selectedSlug && v.isActive) || versions[0];

  const [systemInstruction, setSystemInstruction] = useState(
    activeVersion?.systemInstruction || ''
  );
  const [userPromptTemplate, setUserPromptTemplate] = useState(
    activeVersion?.userPromptTemplate || ''
  );
  const [model, setModel] = useState(activeVersion?.model || 'gemini-2.5-pro');
  const [temperature, setTemperature] = useState(activeVersion?.temperature ?? 0.2);
  const [topP, setTopP] = useState(activeVersion?.topP ?? 0.9);
  const [changeNotes, setChangeNotes] = useState('');

  // Sandbox State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    latencyMs?: number;
    modelUsed?: string;
    rawText?: string;
    parsedJson?: unknown;
    error?: string;
  } | null>(null);

  // Deploy State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Switch template
  const handleSelectTemplate = (slug: string) => {
    setSelectedSlug(slug);
    const targetVer = versions.find((v) => v.templateSlug === slug && v.isActive) || versions.find((v) => v.templateSlug === slug);
    if (targetVer) {
      setSystemInstruction(targetVer.systemInstruction);
      setUserPromptTemplate(targetVer.userPromptTemplate);
      setModel(targetVer.model);
      setTemperature(targetVer.temperature);
      setTopP(targetVer.topP);
      setChangeNotes('');
      setTestResult(null);
    }
  };

  // Run Test in Sandbox
  const handleRunSandboxTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const sampleResponses = `Question 1: Latency spike before demo -> Candidate chose Option B (Triage underlying slow query) with rationale: "I prioritize systemic stability and stakeholder transparency."`;
      const interpolatedPrompt = userPromptTemplate
        .replace('{{roleTarget}}', 'Lead Software Engineer')
        .replace('{{assessmentVersion}}', '1.0')
        .replace('{{candidateName}}', 'Pooja Hegde')
        .replace('{{candidateLanguage}}', 'en')
        .replace('{{targetLanguage}}', 'en')
        .replace('{{candidateResponses}}', sampleResponses);

      const res = await fetch('/api/prompts/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction,
          userPrompt: interpolatedPrompt,
          model,
          temperature,
        }),
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: unknown) {
      setTestResult({ error: err instanceof Error ? err.message : 'Sandbox test failed.' });
    } finally {
      setIsTesting(false);
    }
  };

  // Deploy new prompt version
  const handleDeployVersion = async () => {
    setIsDeploying(true);
    setDeploySuccess(false);
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateSlug: selectedSlug,
          systemInstruction,
          userPromptTemplate,
          model,
          temperature,
          topP,
          changeNotes,
          createdByName: 'Admin User',
        }),
      });

      const data = await res.json();
      if (data.success && data.version) {
        setVersions((prev) => [
          data.version,
          ...prev.map((v) => (v.templateSlug === selectedSlug ? { ...v, isActive: false } : v)),
        ]);
        setDeploySuccess(true);
        setTimeout(() => setDeploySuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-2xl p-6 border border-[var(--ulipsu-border)] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                Admin Prompt Control
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--ulipsu-indigo-light)] text-[var(--ulipsu-indigo)]">
                AI Powered Studio
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Prompt Management & Versioning Engine
            </h1>
            <p className="text-xs text-[var(--ulipsu-muted)] mt-1">
              Configure, version, benchmark, and deploy structured system instructions and evaluation prompts.
            </p>
          </div>

          {/* Template Selector Pills */}
          <div className="flex items-center gap-2 bg-[var(--ulipsu-surface)] p-1.5 rounded-xl border border-[var(--ulipsu-border)]">
            {templates.map((tpl) => (
              <button
                key={tpl.slug}
                onClick={() => handleSelectTemplate(tpl.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSlug === tpl.slug
                    ? 'bg-[var(--ulipsu-indigo)] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Prompt Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* System Instructions */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--ulipsu-indigo)]" />
                AI System Instructions
              </h2>
              <span className="text-xs text-gray-400">Guiding constraints & guardrails</span>
            </div>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              rows={6}
              className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] font-mono text-xs text-gray-800 leading-relaxed bg-gray-50/50"
            />
          </div>

          {/* User Prompt Template */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-[var(--ulipsu-amber-hover)]" />
                User Prompt Template (with Variable Interpolation)
              </h2>
              <span className="text-xs text-gray-400">Interpolates candidate answers & rubrics</span>
            </div>
            <textarea
              value={userPromptTemplate}
              onChange={(e) => setUserPromptTemplate(e.target.value)}
              rows={14}
              className="w-full p-3.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--ulipsu-indigo)] font-mono text-xs text-gray-800 leading-relaxed bg-gray-50/50"
            />
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Change notes (e.g. Added STAR metric check)..."
                value={changeNotes}
                onChange={(e) => setChangeNotes(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[var(--ulipsu-indigo)] w-64"
              />
              <button
                onClick={handleDeployVersion}
                disabled={isDeploying}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--ulipsu-indigo)] text-white hover:bg-[var(--ulipsu-indigo-hover)] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                {isDeploying ? 'Deploying...' : 'Deploy New Version'}
              </button>
            </div>

            <button
              onClick={handleRunSandboxTest}
              disabled={isTesting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--ulipsu-amber)] text-gray-950 hover:bg-[var(--ulipsu-amber-hover)] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {isTesting ? 'Running Simulation...' : 'Run Sandbox Simulation'}
            </button>
          </div>

          {deploySuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Prompt version successfully deployed as active production baseline!</span>
            </div>
          )}
        </div>

        {/* Right Col: Hyperparameters & Sandbox Output */}
        <div className="space-y-6">
          {/* Hyperparameters Card */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-[var(--ulipsu-indigo)]" />
              Model Parameters
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Target Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium"
                >
                  <option value="gemini-2.5-pro">AI Intelligence Engine Pro (Recommended)</option>
                  <option value="gemini-2.5-flash">AI Fast Reasoning Flash</option>
                  <option value="gemini-3.1">AI Advanced Cognitive Engine 3.1</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Temperature</span>
                  <span className="text-[var(--ulipsu-indigo)]">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-[var(--ulipsu-indigo)]"
                />
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  Lower = more deterministic rubric scoring
                </span>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-gray-700 mb-1">
                  <span>Top-P</span>
                  <span className="text-[var(--ulipsu-indigo)]">{topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(e) => setTopP(parseFloat(e.target.value))}
                  className="w-full accent-[var(--ulipsu-indigo)]"
                />
              </div>
            </div>
          </div>

          {/* Sandbox Output Panel */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Sandbox Output & Telemetry
            </h2>

            {testResult ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span>Latency: <strong>{testResult.latencyMs}ms</strong></span>
                  <span>Model: <strong>{testResult.modelUsed}</strong></span>
                </div>

                <div className="bg-gray-950 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] max-h-80 overflow-y-auto leading-relaxed">
                  <pre>{JSON.stringify(testResult.parsedJson || testResult.rawText, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                Click "Run Sandbox Simulation" to test this prompt in real time.
              </div>
            )}
          </div>

          {/* Version History Card */}
          <div className="bg-white rounded-2xl border border-[var(--ulipsu-border)] p-6 shadow-xs">
            <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-purple-600" />
              Version Commit History
            </h2>
            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {versions
                .filter((v) => v.templateSlug === selectedSlug)
                .map((ver) => (
                  <div
                    key={ver.versionNumber}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      ver.isActive
                        ? 'border-emerald-300 bg-emerald-50/50'
                        : 'border-gray-200 bg-gray-50/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900">v{ver.versionNumber}</span>
                        {ver.isActive && (
                          <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500 block truncate max-w-[160px]">
                        {ver.changeNotes || 'Production snapshot'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
