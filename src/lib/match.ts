import { TASTE_AXES, type TasteRange } from '../data/keywords'
import type { Store } from '../data/stores'
import type { UserProfile } from '../state/AppContext'

/** Share of the user's picks that the store also has (0–1). */
function coverage(userPicks: string[], storeTags: string[]): number {
  if (userPicks.length === 0) return 0.5
  const hits = userPicks.filter((k) => storeTags.includes(k)).length
  return Math.min(1, hits / Math.min(userPicks.length, Math.max(storeTags.length, 1)))
}

/** Average overlap of two ranges per taste axis (0–1). */
function tasteOverlap(a: TasteRange, b: TasteRange): number {
  let sum = 0
  for (const { key } of TASTE_AXES) {
    const [a0, a1] = a[key]
    const [b0, b1] = b[key]
    const inter = Math.max(0, Math.min(a1, b1) - Math.max(a0, b0))
    const base = Math.max(1, Math.min(a1 - a0, b1 - b0))
    sum += Math.min(1, inter / base)
  }
  return sum / TASTE_AXES.length
}

export interface MatchBreakdown {
  score: number
  shared: string[]
}

export function matchScore(user: UserProfile | null, store: Store): MatchBreakdown {
  if (!user) return { score: 50, shared: [] }
  const raw =
    0.3 * coverage(user.aromas, store.aromas) +
    0.3 * coverage(user.moods, store.moods) +
    0.15 * coverage(user.menuTypes, store.menuTypes) +
    0.25 * tasteOverlap(user.taste, store.taste)
  const shared = [
    ...user.aromas.filter((a) => store.aromas.includes(a)),
    ...user.moods.filter((m) => store.moods.includes(m)),
    ...user.menuTypes.filter((m) => store.menuTypes.includes(m)),
  ]
  // Map to a 35–99 display range so a weak fit still reads as "some fit".
  return { score: Math.round(35 + raw * 64), shared }
}

export const INSTANT_MATCH_THRESHOLD = 60
