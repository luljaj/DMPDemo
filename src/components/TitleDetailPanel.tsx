import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CLUSTERS } from '../data/clusters'
import { REGIONS } from '../data/regions'
import type { RegionFilter } from '../data/types'
import type { RankedTitle } from '../utils/scoring'
import { METRIC_LABELS, SCORE_METRICS } from '../utils/scoring'

interface TitleDetailPanelProps {
  selected: RankedTitle | null
  region: RegionFilter
  onClose: () => void
}

const contributionPalette = ['#fb923c', '#f97316', '#ef4444', '#f59e0b', '#38bdf8', '#22d3ee']

export function TitleDetailPanel({ selected, region, onClose }: TitleDetailPanelProps) {
  if (!selected) {
    return null
  }

  const scoreBreakdown = SCORE_METRICS.map((metric, index) => ({
    metric,
    label: METRIC_LABELS[metric],
    value: selected.contributions[metric],
    fill: contributionPalette[index],
  })).sort((a, b) => b.value - a.value)

  const clusterData = CLUSTERS.map((cluster) => ({
    name: cluster.name,
    value: selected.title.clusterDistribution[cluster.id],
    fill: cluster.color,
  }))

  const regionData = REGIONS.map((regionOption) => {
    const data = selected.title.regionData[regionOption.code]
    return {
      region: regionOption.code,
      completionRate: data.completionRate,
      overIndex: data.overIndex,
    }
  })

  const tooltipNumber = (value: unknown): number => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <button
        type="button"
        className="h-full flex-1 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close detail view"
      />

      <aside className="h-full w-full max-w-3xl overflow-y-auto border-l border-white/10 bg-slate-950/95 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
              Title Deep Dive
            </p>
            <h3 className="mt-2 text-3xl font-bold text-white">{selected.title.name}</h3>
            <p className="mt-1 text-sm text-slate-400">
              Rank #{selected.rank} • Score {selected.score.toFixed(1)} • Region context:{' '}
              <span className="font-semibold text-slate-200">
                {region === 'GLOBAL' ? 'Global' : region}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-orange-300 hover:text-orange-200"
          >
            Close
          </button>
        </div>

        <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/65 p-4">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Score Breakdown
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBreakdown} layout="vertical" margin={{ left: 30, right: 10 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  dataKey="label"
                  type="category"
                  width={150}
                  tick={{ fill: '#cbd5e1', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(148, 163, 184, 0.3)',
                    borderRadius: '8px',
                    color: '#e2e8f0',
                  }}
                  formatter={(value) => [
                    `${tooltipNumber(value).toFixed(2)} pts`,
                    'Contribution',
                  ]}
                />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {scoreBreakdown.map((entry) => (
                    <Cell key={entry.metric} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-6 rounded-2xl border border-white/10 bg-slate-900/65 p-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Key Drivers Summary
          </h4>
          <p className="text-sm leading-relaxed text-slate-200">{selected.title.keySummary}</p>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
              Cluster Distribution
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clusterData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {clusterData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                    formatter={(value) => [
                      `${tooltipNumber(value).toFixed(0)}%`,
                      'Audience Share',
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1">
              {clusterData.map((cluster) => (
                <div key={cluster.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cluster.fill }}
                    />
                    {cluster.name}
                  </span>
                  <span className="font-semibold text-slate-100">{cluster.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/65 p-4">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
              Region Performance
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <XAxis dataKey="region" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[50, 100]} />
                  <Tooltip
                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(148, 163, 184, 0.3)',
                      borderRadius: '8px',
                      color: '#e2e8f0',
                    }}
                    formatter={(value) => [
                      `${tooltipNumber(value).toFixed(1)}%`,
                      'Completion Rate',
                    ]}
                  />
                  <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
                    {regionData.map((entry) => (
                      <Cell
                        key={entry.region}
                        fill={entry.overIndex ? '#f97316' : '#334155'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Orange bars indicate over-indexing regions versus the title baseline.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-orange-300/30 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-rose-500/10 p-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-orange-200">
            Expansion Recommendation
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {selected.title.expansionSuggestions.map((suggestion) => (
              <span
                key={suggestion}
                className="rounded-full border border-orange-200/40 bg-orange-200/10 px-3 py-1 text-xs font-semibold text-orange-100"
              >
                {suggestion}
              </span>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-100">
            {selected.title.expansionRationale}
          </p>
        </section>
      </aside>
    </div>
  )
}
