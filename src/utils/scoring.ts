import type {
  RegionFilter,
  ScoreMetricKey,
  ScoreWeights,
  TitleProfile,
} from '../data/types'

export const SCORE_METRICS: ScoreMetricKey[] = [
  'completionRate',
  'rewatchRate',
  'returnRate7d',
  'multiRegionStrength',
  'audienceBreadth',
  'bingeIntensity',
]

export const METRIC_LABELS: Record<ScoreMetricKey, string> = {
  completionRate: 'Completion Rate',
  rewatchRate: 'Rewatch Rate',
  returnRate7d: '7-Day Return Rate',
  multiRegionStrength: 'Multi-Region Strength',
  audienceBreadth: 'Audience Breadth',
  bingeIntensity: 'Binge Intensity',
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  completionRate: 0.25,
  rewatchRate: 0.2,
  returnRate7d: 0.2,
  multiRegionStrength: 0.15,
  audienceBreadth: 0.1,
  bingeIntensity: 0.1,
}

export interface RankedTitle {
  rank: number
  title: TitleProfile
  score: number
  normalizedMetrics: Record<ScoreMetricKey, number>
  contributions: Record<ScoreMetricKey, number>
  topDriver: ScoreMetricKey
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const round = (value: number, precision = 1): number => {
  const scale = 10 ** precision
  return Math.round(value * scale) / scale
}

const getCompletionByRegion = (title: TitleProfile, region: RegionFilter): number => {
  if (region === 'GLOBAL') {
    return title.completionRate
  }

  return title.regionData[region].completionRate
}

const getMetricValue = (
  title: TitleProfile,
  metric: ScoreMetricKey,
  region: RegionFilter,
): number => {
  if (metric === 'completionRate') {
    return getCompletionByRegion(title, region)
  }

  return title[metric]
}

const normalizeValue = (value: number, min: number, max: number): number => {
  if (max === min) {
    return 50
  }

  return ((value - min) / (max - min)) * 100
}

export const normalizeWeights = (weights: ScoreWeights): ScoreWeights => {
  const total = SCORE_METRICS.reduce((sum, metric) => sum + weights[metric], 0)

  if (total <= 0) {
    const equalWeight = 1 / SCORE_METRICS.length
    return SCORE_METRICS.reduce(
      (acc, metric) => {
        acc[metric] = equalWeight
        return acc
      },
      {} as ScoreWeights,
    )
  }

  return SCORE_METRICS.reduce(
    (acc, metric) => {
      acc[metric] = weights[metric] / total
      return acc
    },
    {} as ScoreWeights,
  )
}

export const rebalanceWeights = (
  currentWeights: ScoreWeights,
  changedMetric: ScoreMetricKey,
  nextValue: number,
): ScoreWeights => {
  const boundedNext = clamp(nextValue, 0, 1)
  const otherMetrics = SCORE_METRICS.filter((metric) => metric !== changedMetric)
  const currentOtherTotal = otherMetrics.reduce(
    (sum, metric) => sum + currentWeights[metric],
    0,
  )

  const remaining = 1 - boundedNext
  const nextWeights: ScoreWeights = {
    ...currentWeights,
    [changedMetric]: boundedNext,
  }

  if (currentOtherTotal <= 0) {
    const share = remaining / otherMetrics.length
    otherMetrics.forEach((metric) => {
      nextWeights[metric] = share
    })
  } else {
    otherMetrics.forEach((metric) => {
      nextWeights[metric] = (currentWeights[metric] / currentOtherTotal) * remaining
    })
  }

  return normalizeWeights(nextWeights)
}

export const computeRankedTitles = (
  titles: TitleProfile[],
  inputWeights: ScoreWeights,
  region: RegionFilter = 'GLOBAL',
): RankedTitle[] => {
  const weights = normalizeWeights(inputWeights)

  const metricRanges = SCORE_METRICS.reduce(
    (acc, metric) => {
      const values = titles.map((title) => getMetricValue(title, metric, region))
      acc[metric] = {
        min: Math.min(...values),
        max: Math.max(...values),
      }
      return acc
    },
    {} as Record<ScoreMetricKey, { min: number; max: number }>,
  )

  const scored = titles.map((title) => {
    const normalizedMetrics = {} as Record<ScoreMetricKey, number>
    const contributions = {} as Record<ScoreMetricKey, number>

    SCORE_METRICS.forEach((metric) => {
      const value = getMetricValue(title, metric, region)
      const { min, max } = metricRanges[metric]
      const normalized = normalizeValue(value, min, max)
      const contribution = normalized * weights[metric]

      normalizedMetrics[metric] = round(normalized, 2)
      contributions[metric] = round(contribution, 2)
    })

    const rawScore = SCORE_METRICS.reduce(
      (sum, metric) => sum + contributions[metric],
      0,
    )

    const topDriver = SCORE_METRICS.reduce((bestMetric, metric) => {
      return contributions[metric] > contributions[bestMetric] ? metric : bestMetric
    }, SCORE_METRICS[0])

    return {
      title,
      normalizedMetrics,
      contributions,
      rawScore,
      topDriver,
    }
  })

  return scored
    .sort((a, b) => b.rawScore - a.rawScore)
    .map((item, index) => ({
      rank: index + 1,
      title: item.title,
      score: round(item.rawScore),
      normalizedMetrics: item.normalizedMetrics,
      contributions: item.contributions,
      topDriver: item.topDriver,
    }))
}
