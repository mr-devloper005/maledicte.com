import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('border border-current/10 bg-current/[0.03] px-8 py-14 text-center', className)}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-current/15 bg-current/[0.06]">
        <SearchX className="h-5 w-5" />
      </div>
      <h2 className="editable-display mt-6 text-[28px] font-light italic">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[13px] leading-7 text-current/60">{description}</p>
      <Link href={actionHref} className="mt-7 inline-flex items-center gap-2 border border-current/20 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.3em] transition hover:border-current/50">
        {actionLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} from the master panel will appear here automatically. The page layout stays ready even when the feed is empty.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved and routed through the contact workflow."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
