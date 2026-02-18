export type RegionCode = 'US' | 'UK' | 'BR' | 'JP' | 'DE' | 'KR'

export type RegionFilter = RegionCode | 'GLOBAL'

export type ClusterKey =
  | 'casualBrowsers'
  | 'bingeWatchers'
  | 'franchiseSuperfans'
  | 'samplers'

export type ScoreMetricKey =
  | 'completionRate'
  | 'rewatchRate'
  | 'returnRate7d'
  | 'multiRegionStrength'
  | 'audienceBreadth'
  | 'bingeIntensity'

export type ScoreWeights = Record<ScoreMetricKey, number>

export interface RegionPerformance {
  completionRate: number
  overIndex: boolean
}

export type RegionPerformanceMap = Record<RegionCode, RegionPerformance>

export type ClusterDistribution = Record<ClusterKey, number>

export interface TitleProfile {
  id: string
  name: string
  genre: string
  originRegion: string
  releaseYear: number
  seasonCount: number
  completionRate: number
  avgPctWatched: number
  rewatchRate: number
  returnRate7d: number
  daysActiveAfter: number
  bingeIntensity: number
  saveToListRate: number
  multiRegionStrength: number
  audienceBreadth: number
  clusterDistribution: ClusterDistribution
  regionData: RegionPerformanceMap
  expansionSuggestions: string[]
  expansionRationale: string
  keySummary: string
}
