import type { RankedTitle } from '../utils/scoring'

interface OverviewCardsProps {
  rows: RankedTitle[]
}

export function OverviewCards({ rows }: OverviewCardsProps) {
  const top = rows[0]
  const averageScore =
    rows.reduce((sum, row) => sum + row.score, 0) / (rows.length === 0 ? 1 : rows.length)
  const highConfidence = rows.filter((row) => row.score >= 70).length

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-orange-300/35 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-slate-900/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">
          Top Candidate
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{top.title.name}</p>
        <p className="mt-1 text-sm text-orange-100/90">Score {top.score.toFixed(1)} / 100</p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Dataset Average
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{averageScore.toFixed(1)}</p>
        <p className="mt-1 text-sm text-slate-400">Synthetic benchmark across all 20 titles</p>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Strong Contenders
        </p>
        <p className="mt-2 text-2xl font-bold text-white">{highConfidence}</p>
        <p className="mt-1 text-sm text-slate-400">Titles currently scoring 70+</p>
      </article>
    </section>
  )
}
