import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Dark luxury editorial task surfaces for maledicte.com.

  Each task shares one cohesive premium identity: warm near-black surfaces,
  gold accent, hairline warm-white borders, Cormorant Garamond display +
  Outfit body. Per-task copy (kicker / note) still varies for voice.
  Tokens delivered via CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const BODY_FONT = "'Outfit', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Dark luxury base — every task inherits this; only kicker/note differ.
const base = {
  dark: true,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#0A0806',
  surface: '#1C1916',
  raised: '#252118',
  text: '#F0EDE7',
  muted: '#9A9490',
  line: 'rgba(240,237,231,0.10)',
  accent: '#C9A864',
  accentSoft: 'rgba(201,168,100,0.12)',
  onAccent: '#0A0806',
  glow: 'rgba(201,168,100,0.08)',
  radius: '0',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'In-depth reads, essays and stories worth your time.' },
  listing: { ...base, kicker: 'Businesses', note: 'Find, compare and connect with businesses and places.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Fresh offers and listings, ready to act on.' },
  image: { ...base, kicker: 'Visuals', note: 'A curated visual feed of standout images and galleries.' },
  sbm: { ...base, kicker: 'Bookmarks', note: 'Curated resources and links worth saving.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides, reports and references.' },
  profile: { ...base, kicker: 'People', note: 'Discover creators, professionals and unique profiles.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
