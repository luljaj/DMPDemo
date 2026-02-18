import { useLayoutEffect, useRef } from 'react'
import type { RankedTitle } from '../utils/scoring'
import { METRIC_LABELS } from '../utils/scoring'

interface RankingTableProps {
  rows: RankedTitle[]
  selectedId: string | null
  onSelect: (row: RankedTitle) => void
}

const scoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-300'
  if (score >= 60) return 'text-orange-300'
  return 'text-slate-300'
}

export function RankingTable({ rows, selectedId, onSelect }: RankingTableProps) {
  const rowRefs = useRef(new Map<string, HTMLButtonElement>())
  const previousTopRef = useRef(new Map<string, number>())

  useLayoutEffect(() => {
    const nextTop = new Map<string, number>()

    rows.forEach((row) => {
      const element = rowRefs.current.get(row.title.id)
      if (!element) return

      const newTop = element.getBoundingClientRect().top
      nextTop.set(row.title.id, newTop)

      const previousTop = previousTopRef.current.get(row.title.id)
      if (previousTop === undefined) return

      const delta = previousTop - newTop
      if (Math.abs(delta) < 1) return

      element.animate(
        [
          { transform: `translateY(${delta}px)` },
          { transform: 'translateY(0)' },
        ],
        {
          duration: 420,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        },
      )
    })

    previousTopRef.current = nextTop
  }, [rows])

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
          Franchise Candidate Rankings
        </h2>
      </div>

      <div className="hidden grid-cols-[56px_minmax(170px,1.8fr)_1.1fr_1fr_1.4fr_1.2fr_1.3fr] gap-4 border-b border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:grid">
        <span>Rank</span>
        <span>Title</span>
        <span>Genre</span>
        <span>Origin</span>
        <span>Score</span>
        <span>Top Driver</span>
        <span>Suggested Expansion</span>
      </div>

      <div className="max-h-[65vh] overflow-y-auto">
        {rows.map((row) => {
          const isActive = selectedId === row.title.id

          return (
            <button
              key={row.title.id}
              ref={(element) => {
                if (element) {
                  rowRefs.current.set(row.title.id, element)
                } else {
                  rowRefs.current.delete(row.title.id)
                }
              }}
              type="button"
              onClick={() => onSelect(row)}
              className={`grid w-full grid-cols-1 gap-2 border-b border-white/5 px-5 py-4 text-left transition hover:bg-white/5 lg:grid-cols-[56px_minmax(170px,1.8fr)_1.1fr_1fr_1.4fr_1.2fr_1.3fr] lg:items-center lg:gap-4 ${
                isActive ? 'bg-orange-500/10' : ''
              }`}
            >
              <div className="text-sm font-semibold text-slate-100 lg:text-base">#{row.rank}</div>

              <div>
                <div className="text-sm font-semibold text-slate-100 lg:text-base">
                  {row.title.name}
                </div>
                <div className="text-xs text-slate-400">
                  {row.title.releaseYear} • {row.title.seasonCount} season
                  {row.title.seasonCount > 1 ? 's' : ''}
                </div>
              </div>

              <div className="text-sm text-slate-300">{row.title.genre}</div>
              <div className="text-sm text-slate-300">{row.title.originRegion}</div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className={`font-bold ${scoreColor(row.score)}`}>{row.score.toFixed(1)}</span>
                  <span className="text-slate-400">/100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-700/80">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-400 via-red-500 to-rose-500 transition-all duration-500"
                    style={{ width: `${Math.max(4, row.score)}%` }}
                  />
                </div>
              </div>

              <div className="text-sm text-slate-200">{METRIC_LABELS[row.topDriver]}</div>

              <div>
                <span className="inline-flex rounded-full border border-orange-300/40 bg-orange-400/10 px-2.5 py-1 text-xs font-semibold text-orange-200">
                  {row.title.expansionSuggestions[0]}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
