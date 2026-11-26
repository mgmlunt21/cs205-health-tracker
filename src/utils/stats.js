import { formatDate } from './helpers'

// { 'M/D/YYYY': value } with the average or total of `field` for each logged day
export function dailyValues(entries, field, mode) {
  const groups = {}
  entries.forEach((e) => (groups[e.date] ??= []).push(e[field]))
  return Object.fromEntries(
    Object.entries(groups).map(([date, values]) => {
      const total = values.reduce((sum, v) => sum + v, 0)
      return [date, mode === 'avg' ? total / values.length : total]
    })
  )
}

export function average(values) {
  return values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : null
}

// Consecutive days with an entry, counting back from today (or yesterday if nothing is logged today yet)
export function currentStreak(entries) {
  const dates = new Set(entries.map((e) => e.date))
  const day = new Date()
  if (!dates.has(formatDate(day))) day.setDate(day.getDate() - 1)
  let streak = 0
  while (dates.has(formatDate(day))) {
    streak++
    day.setDate(day.getDate() - 1)
  }
  return streak
}

// Pearson correlation coefficient, or null when there is too little variation to say anything
export function correlation(xs, ys) {
  const mx = average(xs)
  const my = average(ys)
  let cov = 0, vx = 0, vy = 0
  xs.forEach((x, i) => {
    cov += (x - mx) * (ys[i] - my)
    vx += (x - mx) ** 2
    vy += (ys[i] - my) ** 2
  })
  return xs.length >= 3 && vx && vy ? cov / Math.sqrt(vx * vy) : null
}
