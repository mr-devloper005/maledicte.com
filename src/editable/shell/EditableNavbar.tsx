'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((t) => t.enabled).map((t) => ({ label: t.label.toLowerCase(), href: t.route })),
    []
  )

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-700 ${
          scrolled ? 'bg-[#0A0806]/96 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        {/* Top gold accent rule */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--slot4-accent)] to-transparent opacity-40" />

        {/* Row 1 — masthead strip: site name + tagline */}
        <div className="flex h-[43px] items-center border-b border-white/[0.07] px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5 opacity-90 transition-opacity hover:opacity-100">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-7 w-7 object-contain" />
            <span className="editable-display text-[21px] font-light italic tracking-[0.06em] text-white">
              {SITE_CONFIG.name.toLowerCase()}
            </span>
          </Link>

          {/* Vertical divider + editorial label — desktop only */}
          <span className="mx-4 hidden h-3.5 w-px bg-white/20 lg:block" />
          <span className="hidden text-[8px] font-medium uppercase tracking-[0.48em] text-white/20 lg:block">
            editorial
          </span>

          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/search"
              className="text-[8px] font-medium uppercase tracking-[0.42em] text-white/35 transition-opacity hover:text-white/70"
            >
              search
            </Link>

            {/* Mobile toggle — text-only, no icon */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="text-[8px] font-medium uppercase tracking-[0.42em] text-white/50 transition-opacity hover:text-white/90 lg:hidden"
            >
              {open ? 'close' : 'menu'}
            </button>
          </div>
        </div>

        {/* Row 2 — numbered nav items (desktop only) */}
        <div className="hidden h-[32px] items-center px-6 lg:flex lg:px-10">
          <nav className="flex items-center gap-6">
            {navItems.slice(0, 5).map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-baseline gap-1.5 transition-opacity ${
                  isActive(item.href) ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                }`}
              >
                <span className={`text-[7px] font-medium ${isActive(item.href) ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-accent)]'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`text-[9px] font-medium uppercase tracking-[0.32em] ${isActive(item.href) ? 'text-[var(--slot4-accent)]' : 'text-white'}`}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <Link
              href="/about"
              className={`text-[9px] font-medium uppercase tracking-[0.32em] transition-opacity ${
                isActive('/about') ? 'text-[var(--slot4-accent)] opacity-100' : 'text-white opacity-30 hover:opacity-65'
              }`}
            >
              about
            </Link>

            {session ? (
              <>
                <Link
                  href="/create"
                  className="text-[9px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-accent)] opacity-65 transition-opacity hover:opacity-100"
                >
                  create
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[9px] font-medium uppercase tracking-[0.32em] text-white opacity-22 transition-opacity hover:opacity-50"
                >
                  logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[9px] font-medium uppercase tracking-[0.32em] text-white opacity-22 transition-opacity hover:opacity-55"
                >
                  login
                </Link>
                <Link
                  href="/signup"
                  className="text-[9px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-accent)] opacity-60 transition-opacity hover:opacity-100"
                >
                  join
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile full-screen overlay — slides in from below the header */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex flex-col bg-[#070504] transition-all duration-500 ease-in-out lg:hidden ${
          open ? 'top-[76px] opacity-100' : 'top-full opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-1 flex-col justify-center px-8 pb-12">
          {[
            { label: 'home', href: '/' },
            ...navItems,
            { label: 'about', href: '/about' },
            { label: 'contact', href: '/contact' },
          ].map((item, i) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group flex items-baseline gap-4 border-b border-white/[0.06] py-5 transition-opacity ${
                  active ? 'opacity-100' : 'opacity-40 hover:opacity-85'
                }`}
              >
                <span className="w-7 shrink-0 text-right text-[9px] font-medium text-[var(--slot4-accent)] opacity-70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className={`editable-display text-[clamp(28px,8vw,44px)] font-light italic leading-tight ${
                    active ? 'text-[var(--slot4-accent)]' : 'text-white'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}

          <div className="mt-8 flex items-center gap-6 pl-11">
            {session ? (
              <>
                <Link
                  href="/create"
                  onClick={() => setOpen(false)}
                  className="text-[9px] font-medium uppercase tracking-[0.34em] text-[var(--slot4-accent)] opacity-70"
                >
                  create
                </Link>
                <button
                  type="button"
                  onClick={() => { logout(); setOpen(false) }}
                  className="text-[9px] font-medium uppercase tracking-[0.34em] text-white opacity-30"
                >
                  logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="text-[9px] font-medium uppercase tracking-[0.34em] text-white opacity-35"
                >
                  login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="text-[9px] font-medium uppercase tracking-[0.34em] text-[var(--slot4-accent)] opacity-75"
                >
                  join
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Bottom strip: subtle branding */}
        <div className="border-t border-white/[0.06] px-8 py-4">
          <span className="text-[8px] font-medium uppercase tracking-[0.42em] text-white/18">
            {SITE_CONFIG.name.toLowerCase()} · editorial
          </span>
        </div>
      </div>
    </>
  )
}
