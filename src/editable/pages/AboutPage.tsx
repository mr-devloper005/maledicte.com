import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="px-4 py-16 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[var(--editable-container)]">

          {/* Page header */}
          <header className="mb-14 max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-[var(--slot4-accent)]">
              {pagesContent.about.badge}
            </p>
            <h1 className="editable-display mt-4 text-[clamp(40px,6vw,72px)] font-light italic leading-[1.02]">
              About {SITE_CONFIG.name}
            </h1>
            <p className="mt-5 text-base leading-8 text-[var(--slot4-muted-text)]">
              {pagesContent.about.description}
            </p>
          </header>

          {/* Two-column content */}
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 lg:p-12">
              <div className="space-y-5 text-[15px] leading-8 text-[var(--slot4-muted-text)]">
                {pagesContent.about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>

            <aside className="flex flex-col gap-4">
              {pagesContent.about.values.map((value) => (
                <div
                  key={value.title}
                  className="border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6"
                >
                  <h2 className="editable-display text-[22px] font-light italic">
                    {value.title}
                  </h2>
                  <p className="mt-3 text-[13px] leading-7 text-[var(--slot4-muted-text)]">
                    {value.description}
                  </p>
                </div>
              ))}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
