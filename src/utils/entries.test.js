import { describe, it, expect } from 'vitest'
import { parseData } from './entries'

const base = { id: 1, date: '1/15/2024', time: '12:00 PM', timestamp: '2024-01-15T20:00:00.000Z' }

describe('parseData', () => {
  it('accepts a valid file and fills in missing lists and settings', () => {
    const data = parseData({ moodEntries: [{ ...base, mood: 4 }] })
    expect(data.moodEntries).toHaveLength(1)
    expect(data.mealEntries).toEqual([])
    expect(data.settings.waterGoalMl).toBe(2000)
  })

  it('accepts every tracker with its optional fields', () => {
    const data = parseData({
      moodEntries: [{ ...base, mood: 5, note: 'Great day' }],
      sleepEntries: [{ ...base, hours: 7.5, quality: 4, bedtime: '23:30', wakeTime: '07:00' }],
      waterEntries: [{ ...base, ml: 500 }],
      exerciseEntries: [{ ...base, type: 'Running', minutes: 30, calories: 300 }],
      mealEntries: [{ ...base, name: 'Lunch', calories: 650 }],
      settings: { waterGoalMl: 2500 },
    })
    expect(data).not.toBeNull()
    expect(data.settings.waterGoalMl).toBe(2500)
  })

  it.each([
    ['not an object', 'hello'],
    ['no tracker lists', { foo: [] }],
    ['a list that is not an array', { moodEntries: 'oops' }],
    ['mood out of range', { moodEntries: [{ ...base, mood: 9 }] }],
    ['mood that is not a whole number', { moodEntries: [{ ...base, mood: 3.5 }] }],
    ['an impossible date', { moodEntries: [{ ...base, date: '2/30/2024', mood: 3 }] }],
    ['a bad timestamp', { moodEntries: [{ ...base, timestamp: 'yesterday', mood: 3 }] }],
    ['a note that is too long', { moodEntries: [{ ...base, mood: 3, note: 'x'.repeat(281) }] }],
    ['sleep over 24 hours', { sleepEntries: [{ ...base, hours: 25, quality: 3 }] }],
    ['a malformed bedtime', { sleepEntries: [{ ...base, hours: 8, quality: 3, bedtime: '25:00' }] }],
    ['zero water', { waterEntries: [{ ...base, ml: 0 }] }],
    ['an empty exercise name', { exerciseEntries: [{ ...base, type: '  ', minutes: 30 }] }],
    ['a meal without calories', { mealEntries: [{ ...base, name: 'Lunch' }] }],
    ['a water goal out of range', { moodEntries: [], settings: { waterGoalMl: 50 } }],
  ])('rejects %s', (_, raw) => {
    expect(parseData(raw)).toBeNull()
  })
})
