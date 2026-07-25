'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = [
  'border border-[var(--editable-border)]',
  'bg-[var(--slot4-surface-bg)]',
  'px-4 py-3 text-[14px] font-light',
  'text-[var(--slot4-page-text)]',
  'outline-none transition duration-200',
  'placeholder:text-[var(--slot4-muted-text)]',
  'focus:border-[var(--slot4-accent)]/50',
  'w-full',
].join(' ')

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-page-bg)] px-6 py-16 text-[var(--slot4-page-text)] lg:px-10">
          <section className="mx-auto grid max-w-4xl gap-0 border border-[var(--editable-border)] md:grid-cols-[1fr_1.4fr]">
            <div className="flex min-h-64 items-center justify-center bg-[var(--slot4-panel-bg)] p-12">
              <Lock className="h-14 w-14 text-[var(--slot4-accent)] opacity-40" />
            </div>
            <div className="border-l border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10">
              <p className="text-[9px] font-medium uppercase tracking-[0.44em] text-[var(--slot4-accent)] opacity-70">
                {pagesContent.create.locked.badge}
              </p>
              <h1 className="editable-display mt-4 text-[clamp(32px,5vw,52px)] font-light italic leading-[1.05]">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-5 text-[14px] leading-7 text-[var(--slot4-muted-text)]">
                {pagesContent.create.locked.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-[var(--slot4-accent)] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-on-accent)] transition hover:opacity-90"
                >
                  Login <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--slot4-muted-text)] transition hover:border-[var(--slot4-accent)]/50 hover:text-[var(--slot4-page-text)]"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-6 py-12 lg:px-10 lg:py-16">
          <div className="grid gap-0 border border-[var(--editable-border)] lg:grid-cols-[0.75fr_1.25fr]">

            {/* Left: intro + task selector */}
            <aside className="border-b border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-8 lg:border-b-0 lg:border-r lg:p-10">
              <p className="text-[9px] font-medium uppercase tracking-[0.44em] text-[var(--slot4-accent)] opacity-70">
                {pagesContent.create.hero.badge}
              </p>
              <h1 className="editable-display mt-4 text-[clamp(28px,4vw,44px)] font-light italic leading-[1.06]">
                {pagesContent.create.hero.title}
              </h1>
              <p className="mt-4 text-[13px] leading-7 text-[var(--slot4-muted-text)]">
                {pagesContent.create.hero.description}
              </p>

            </aside>

            {/* Right: form */}
            <form onSubmit={submit} className="bg-[var(--slot4-surface-bg)] p-8 lg:p-10">
              {/* Form header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--editable-border)] pb-6">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.44em] text-[var(--slot4-accent)] opacity-60">
                    Create {activeTask?.label || 'post'}
                  </p>
                  <h2 className="editable-display mt-2 text-[26px] font-light italic">
                    {pagesContent.create.formTitle}
                  </h2>
                </div>
                <span className="border border-[var(--editable-border)] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-muted-text)]">
                  {session.name}
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                <input
                  className={fieldClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                  required
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className={fieldClass}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                  />
                  <input
                    className={fieldClass}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Website or source URL"
                  />
                </div>
                <input
                  className={fieldClass}
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Featured image URL"
                />
                <textarea
                  className={`${fieldClass} min-h-[96px] resize-y`}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short summary"
                  required
                />
                <textarea
                  className={`${fieldClass} min-h-[160px] resize-y`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Main content, details, notes, or description"
                  required
                />
              </div>

              {created && (
                <div className="mt-4 flex items-start gap-3 border border-[var(--slot4-accent)]/20 bg-[var(--slot4-accent)]/[0.06] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  <div>
                    <p className="text-[12px] font-medium text-[var(--slot4-page-text)]">{pagesContent.create.successTitle}</p>
                    <p className="mt-0.5 text-[11px] text-[var(--slot4-muted-text)]">{created.title}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 bg-[var(--slot4-accent)] text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--slot4-on-accent)] transition hover:opacity-90"
              >
                <Send className="h-3.5 w-3.5" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
