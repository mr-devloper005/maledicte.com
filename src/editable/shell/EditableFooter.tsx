'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-[1fr_auto_auto] lg:gap-20">

          {/* Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-3 opacity-85 transition-opacity hover:opacity-100">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
              <span className="editable-display text-[24px] font-light italic tracking-[0.06em] text-[var(--editable-footer-text)]">
                {SITE_CONFIG.name.toLowerCase()}
              </span>
            </Link>
            <p className="mt-4 text-[13px] leading-7 text-[var(--slot4-muted-text)]">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Explore column */}
          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.42em] text-[var(--slot4-accent)]">
              Explore
            </p>
            <div className="flex flex-col gap-3">
              {taskLinks.map((task) => (
                <Link
                  key={task.key}
                  href={task.route}
                  className="editable-display text-[15px] font-light italic text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--editable-footer-text)]"
                >
                  {task.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Site column */}
          <div>
            <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.42em] text-[var(--slot4-accent)]">
              Site
            </p>
            <div className="flex flex-col gap-3">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Join', '/signup']]),
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="editable-display text-[15px] font-light italic text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--editable-footer-text)]"
                >
                  {label}
                </Link>
              ))}
              {session && (
                <button
                  type="button"
                  onClick={logout}
                  className="editable-display text-left text-[15px] font-light italic text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--editable-footer-text)]"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--editable-border)] pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] font-light tracking-[0.12em] text-[var(--slot4-muted-text)]">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-[11px] font-light tracking-[0.1em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--editable-footer-text)]">
              About
            </Link>
            <Link href="/contact" className="text-[11px] font-light tracking-[0.1em] text-[var(--slot4-muted-text)] transition-colors hover:text-[var(--editable-footer-text)]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
