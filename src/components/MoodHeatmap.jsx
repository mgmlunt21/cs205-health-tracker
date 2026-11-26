import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { formatDate } from '../utils/helpers'
import { dailyValues } from '../utils/stats'

const COLORS = ['bg-red-400', 'bg-orange-300', 'bg-yellow-300', 'bg-lime-400', 'bg-green-500']

function MoodHeatmap() {
  const { moodEntries } = useHealthData()
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))

  const mood = dailyValues(moodEntries, 'mood', 'avg')
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))
  const shiftMonth = (delta) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1))

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => shiftMonth(-1)} className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Previous month">‹</button>
        <h3 className="text-xl font-semibold text-gray-800">
          Mood Calendar – {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => shiftMonth(1)} className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Next month">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
        {Array.from({ length: month.getDay() }, (_, i) => <div key={`blank-${i}`} />)}
        {days.map((day) => {
          const value = mood[formatDate(day)]
          return (
            <div
              key={day.getDate()}
              title={value ? `${formatDate(day)}: average mood ${value.toFixed(1)}` : `${formatDate(day)}: no entries`}
              className={`aspect-square rounded flex items-center justify-center text-gray-900 ${
                value ? COLORS[Math.round(value) - 1] : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {day.getDate()}
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-end gap-1 mt-3 text-xs text-gray-500">
        Low {COLORS.map((c) => <span key={c} className={`w-4 h-4 rounded ${c}`} />)} High
      </div>
    </div>
  )
}

export default MoodHeatmap
