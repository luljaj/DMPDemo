import type { ClusterKey } from './types'

export interface ClusterDefinition {
  id: ClusterKey
  name: string
  description: string
  color: string
}

export const CLUSTERS: ClusterDefinition[] = [
  {
    id: 'casualBrowsers',
    name: 'Casual Browsers',
    description: 'Low completion, low rewatch, broad light sampling.',
    color: '#667eea',
  },
  {
    id: 'bingeWatchers',
    name: 'Binge Watchers',
    description: 'High binge intensity and fast title turnover.',
    color: '#f97316',
  },
  {
    id: 'franchiseSuperfans',
    name: 'Franchise Superfans',
    description: 'High completion, high rewatch, high post-finish engagement.',
    color: '#ef4444',
  },
  {
    id: 'samplers',
    name: 'Samplers',
    description: 'Moderate metrics with broad cross-genre behavior.',
    color: '#14b8a6',
  },
]
