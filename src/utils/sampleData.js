import { createEntry } from './helpers'
import { EMPTY_DATA } from './entries'

const pick = (list) => list[Math.floor(Math.random() * list.length)]
const between = (min, max) => min + Math.random() * (max - min)
const rating = (center) => Math.min(5, Math.max(1, Math.round(center + between(-1, 1))))

// 60 days of made-up entries for demos. Mood loosely follows sleep so the correlation chart has something to show.
export function generateSampleData() {
  const data = structuredClone(EMPTY_DATA)
  const at = (daysAgo, hour) => {
    const d = new Date()
    d.setDate(d.getDate() - daysAgo)
    d.setHours(hour, Math.floor(between(0, 60)), 0, 0)
    return d
  }
  const add = (kind, fields, date) => data[kind].push({ ...createEntry(fields, date), id: date.getTime() + data[kind].length })

  for (let daysAgo = 59; daysAgo >= 0; daysAgo--) {
    const hours = Math.round(between(5, 9) * 2) / 2
    const wakeMinutes = (23 + hours) * 60 % 1440
    const wakeTime = `0${Math.floor(wakeMinutes / 60)}:${String(wakeMinutes % 60).padStart(2, '0')}`
    add('sleepEntries', { hours, quality: rating(hours - 3.5), bedtime: '23:00', wakeTime }, at(daysAgo, 7))
    add('moodEntries', { mood: rating(hours - 4) }, at(daysAgo, 12))

    const glasses = Math.round(between(3, 8))
    for (let i = 0; i < glasses; i++) add('waterEntries', { ml: pick([250, 500]) }, at(daysAgo, 8 + i * 2))
    if (Math.random() < 0.6) add('exerciseEntries', { type: pick(['Running', 'Cycling', 'Yoga', 'Walking']), minutes: pick([20, 30, 45, 60]), calories: pick([150, 250, 400]) }, at(daysAgo, 18))
    ;[['Breakfast', 400], ['Lunch', 700], ['Dinner', 800]].forEach(([name, kcal], i) =>
      add('mealEntries', { name, calories: kcal + Math.round(between(-150, 150)) }, at(daysAgo, 8 + i * 5))
    )
  }
  return data
}
