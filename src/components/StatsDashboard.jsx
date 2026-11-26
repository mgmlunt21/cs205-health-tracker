import { useHealthData } from '../context/HealthDataContext'
import { dailyValues, average, currentStreak } from '../utils/stats'

const TRACKERS = [
  { kind: 'moodEntries', label: 'Mood', field: 'mood', mode: 'avg', unit: '/ 5' },
  { kind: 'sleepEntries', label: 'Sleep', field: 'hours', mode: 'avg', unit: 'h / night' },
  { kind: 'waterEntries', label: 'Water', field: 'ml', mode: 'sum', unit: 'ml / day' },
  { kind: 'exerciseEntries', label: 'Exercise', field: 'minutes', mode: 'sum', unit: 'min / active day' },
  { kind: 'mealEntries', label: 'Meals', field: 'calories', mode: 'sum', unit: 'kcal / day' },
]

function StatsDashboard() {
  const health = useHealthData()

  const moodDays = Object.entries(dailyValues(health.moodEntries, 'mood', 'avg')).sort((a, b) => b[1] - a[1])
  const waterDays = Object.values(dailyValues(health.waterEntries, 'ml', 'sum'))
  const goalDays = waterDays.filter((ml) => ml >= health.settings.waterGoalMl).length

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        {TRACKERS.map(({ kind, label, field, mode, unit }) => {
          const avg = average(Object.values(dailyValues(health[kind], field, mode)))
          const streak = currentStreak(health[kind])
          return (
            <div key={kind} className="entry-row flex-col items-start">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-2xl font-semibold text-gray-800">
                {avg === null ? '–' : Math.round(avg * 10) / 10}
                <span className="text-sm font-normal text-gray-500"> {unit}</span>
              </p>
              <p className="text-sm text-gray-600">
                {streak > 0 ? `🔥 ${streak}-day streak` : 'No current streak'}
              </p>
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        {moodDays.length > 0 && (
          <p>
            Best mood day: <strong>{moodDays[0][0]}</strong> ({moodDays[0][1].toFixed(1)}) · Worst mood day:{' '}
            <strong>{moodDays.at(-1)[0]}</strong> ({moodDays.at(-1)[1].toFixed(1)})
          </p>
        )}
        {waterDays.length > 0 && (
          <p>Water goal met on <strong>{goalDays}</strong> of {waterDays.length} logged days.</p>
        )}
      </div>
    </div>
  )
}

export default StatsDashboard
