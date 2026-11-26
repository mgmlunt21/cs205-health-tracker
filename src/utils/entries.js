export const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
}

export const ENTRY_KINDS = ['moodEntries', 'sleepEntries', 'waterEntries', 'exerciseEntries', 'mealEntries']

export const DEFAULT_SETTINGS = { waterGoalMl: 2000 }

export const EMPTY_DATA = {
  ...Object.fromEntries(ENTRY_KINDS.map((kind) => [kind, []])),
  settings: DEFAULT_SETTINGS,
}

const inRange = (value, min, max) => typeof value === 'number' && value >= min && value <= max
const isRating = (value) => Number.isInteger(value) && inRange(value, 1, 5)
const isOptional = (value, check) => value === undefined || check(value)
const isText = (max) => (value) => typeof value === 'string' && value.trim().length > 0 && value.length <= max
const isClockTime = (value) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
const isCalories = (value) => inRange(value, 0, 5000)

const VALIDATORS = {
  moodEntries: (e) => isRating(e.mood) && isOptional(e.note, isText(280)),
  sleepEntries: (e) =>
    inRange(e.hours, 0, 24) && isRating(e.quality) && isOptional(e.bedtime, isClockTime) && isOptional(e.wakeTime, isClockTime),
  waterEntries: (e) => inRange(e.ml, 1, 5000),
  exerciseEntries: (e) => isText(50)(e.type) && inRange(e.minutes, 1, 1440) && isOptional(e.calories, isCalories),
  mealEntries: (e) => isText(50)(e.name) && isCalories(e.calories),
}

export const describeEntry = {
  moodEntries: (e) => `Mood: ${e.mood} (${MOOD_LABELS[e.mood]})${e.note ? ` – "${e.note}"` : ''}`,
  sleepEntries: (e) =>
    `Sleep: ${e.hours} h, quality ${e.quality}/5${e.bedtime ? ` (${e.bedtime}–${e.wakeTime})` : ''}`,
  waterEntries: (e) => `Water: ${e.ml} ml`,
  exerciseEntries: (e) => `Exercise: ${e.type}, ${e.minutes} min${e.calories ? `, ${e.calories} kcal` : ''}`,
  mealEntries: (e) => `Meal: ${e.name}, ${e.calories} kcal`,
}

// Returns the validated data, or null if anything is malformed.
// Missing lists and settings fall back to defaults so older files still import.
export function parseData(raw) {
  if (!raw || typeof raw !== 'object' || !ENTRY_KINDS.some((key) => key in raw)) return null

  const settings = { waterGoalMl: raw.settings?.waterGoalMl ?? DEFAULT_SETTINGS.waterGoalMl }
  if (!inRange(settings.waterGoalMl, 250, 10000)) return null

  const data = { settings }
  for (const [key, isValid] of Object.entries(VALIDATORS)) {
    const list = raw[key] ?? []
    const ok = Array.isArray(list) && list.every((e) =>
      e &&
      typeof e.id === 'number' &&
      typeof e.time === 'string' &&
      typeof e.date === 'string' &&
      new Date(e.date).toLocaleDateString('en-US') === e.date && // real M/D/YYYY date
      !isNaN(Date.parse(e.timestamp)) &&
      isValid(e)
    )
    if (!ok) return null
    data[key] = list
  }
  return data
}
