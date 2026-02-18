import type { ScoreMetricKey, ScoreWeights } from '../data/types'
import { METRIC_LABELS, SCORE_METRICS } from '../utils/scoring'

interface WeightAdjusterProps {
  weights: ScoreWeights
  onMetricChange: (metric: ScoreMetricKey, value: number) => void
  onReset: () => void
}

const percent = (value: number): string => `${(value * 100).toFixed(1)}%`

export function WeightAdjuster({
  weights,
  onMetricChange,
  onReset,
}: WeightAdjusterProps) {
  const total = SCORE_METRICS.reduce((sum, metric) => sum + weights[metric], 0)

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-[0_8px_35px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
            Weight Adjuster
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Move one slider and the others auto-normalize to keep a 100% total.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-orange-300 hover:text-orange-200"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {SCORE_METRICS.map((metric) => (
          <label key={metric} className="block">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-200">{METRIC_LABELS[metric]}</span>
              <span className="font-semibold text-orange-300">{percent(weights[metric])}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Math.round(weights[metric] * 100)}
              onChange={(event) => onMetricChange(metric, Number(event.target.value) / 100)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 accent-orange-500"
            />
          </label>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Active total: <span className="font-semibold text-slate-200">{percent(total)}</span>
      </p>
    </section>
  )
}
