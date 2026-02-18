import type { RegionCode } from './types'

export interface RegionOption {
  code: RegionCode
  label: string
}

export const REGIONS: RegionOption[] = [
  { code: 'US', label: 'United States' },
  { code: 'UK', label: 'United Kingdom' },
  { code: 'BR', label: 'Brazil' },
  { code: 'JP', label: 'Japan' },
  { code: 'DE', label: 'Germany' },
  { code: 'KR', label: 'South Korea' },
]
