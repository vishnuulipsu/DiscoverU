'use client';

import React from 'react';

export default function GlobalLayoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0B1120', color: '#F1F5F9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '500px', width: '100%', backgroundColor: '#131C31', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '8px' }}>
            System Level Error
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '16px', lineHeight: 1.5 }}>
            A critical application error occurred. You can reload the page or restart the application session.
          </p>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              onClick={() => reset()}
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#3B82F6', color: '#FFFFFF', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
            >
              Retry
            </button>
            <a
              href="/"
              style={{ padding: '8px 16px', borderRadius: '8px', backgroundColor: '#1E293B', color: '#CBD5E1', border: '1px solid #334155', textDecoration: 'none', fontWeight: 500, fontSize: '0.875rem' }}
            >
              Return Home
            </a>
          </div>
          <div style={{ backgroundColor: '#0B1120', padding: '10px', borderRadius: '8px', fontSize: '0.75rem', color: '#F43F5E', fontFamily: 'monospace', wordBreak: 'break-all' }}>
            {error.message || 'Fatal render error'}
          </div>
        </div>
      </body>
    </html>
  );
}
