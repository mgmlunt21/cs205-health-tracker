import { describe, it, expect } from 'vitest'
import { dailyValues, average, currentStreak, correlation } from './stats'
import { formatDate } from './helpers'

const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return formatDate(d)
}

describe('dailyValues', () => {
  const entries = [
    { date: '1/1/2024', ml: 250 },
    { date: '1/1/2024', ml: 750 },
    { date: '1/2/2024', ml: 500 },
  ]

  it('totals each day in sum mode', () => {
    expect(dailyValues(entries, 'ml', 'sum')).toEqual({ '1/1/2024': 1000, '1/2/2024': 500 })
  })

  it('averages each day in avg mode', () => {
    expect(dailyValues(entries, 'ml', 'avg')).toEqual({ '1/1/2024': 500, '1/2/2024': 500 })
  })
})

describe('average', () => {
  it('returns null for no values', () => {
    expect(average([])).toBeNull()
    expect(average([2, 4])).toBe(3)
  })
})

describe('currentStreak', () => {
  it('counts consecutive days back from today', () => {
    expect(currentStreak([0, 1, 2, 4].map((n) => ({ date: daysAgo(n) })))).toBe(3)
  })

  it('still counts a streak that ended yesterday', () => {
    expect(currentStreak([1, 2].map((n) => ({ date: daysAgo(n) })))).toBe(2)
  })

  it('is 0 when the last entry is older than yesterday', () => {
    expect(currentStreak([{ date: daysAgo(3) }])).toBe(0)
  })
})

describe('correlation', () => {
  it('is 1 or -1 for perfect linear relationships', () => {
    expect(correlation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1)
    expect(correlation([1, 2, 3], [6, 4, 2])).toBeCloseTo(-1)
  })

  it('is null with fewer than 3 points or no variation', () => {
    expect(correlation([1, 2], [1, 2])).toBeNull()
    expect(correlation([5, 5, 5], [1, 2, 3])).toBeNull()
  })
})
