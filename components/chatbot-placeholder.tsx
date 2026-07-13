'use client'

import { MessageSquare } from 'lucide-react'

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CHATBASE AI CHATBOT — INTEGRATION PLACEHOLDER
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  This component reserves the bottom-right space for the Chatbase widget.
 *  Chatbase is NOT implemented here — this is only a visual placeholder.
 *
 *  TO ENABLE CHATBASE:
 *  1. Remove (or hide) the placeholder button below.
 *  2. Add the Chatbase embed script. The recommended place is `app/layout.tsx`,
 *     just before the closing </body> (e.g. using Next.js <Script/> with
 *     strategy="afterInteractive"). Paste your snippet EXACTLY as provided in
 *     your Chatbase dashboard:
 *
 *     // app/layout.tsx
 *     // import Script from 'next/script'
 *     //
 *     // <Script id="chatbase-embed" strategy="afterInteractive">
 *     //   {`(function(){ ... your Chatbase embed code ... })();`}
 *     // </Script>
 *
 *  Chatbase renders its own floating launcher in the bottom-right corner,
 *  so no additional markup is needed once the script is added.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export function ChatbotPlaceholder() {
  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Placeholder launcher — replace with the real Chatbase widget (see notes above). */}
      <button
        type="button"
        aria-label="Open chat (Chatbase placeholder)"
        title="Chatbase widget will appear here"
        className="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_18px_40px_-14px_rgba(31,42,68,0.6)] transition-transform hover:scale-105"
        onClick={() => {
          // Intentionally left as a placeholder. Chatbase will handle opening its own panel.
          console.log('[v0] Chatbase placeholder clicked — add your Chatbase embed to enable.')
        }}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-accent" />
      </button>
    </div>
  )
}
