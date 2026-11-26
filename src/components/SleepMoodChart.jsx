import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'
import { dailyValues, correlation } from '../utils/stats'

function describe(r) {
  const strength = Math.abs(r) >= 0.5 ? 'strong' : Math.abs(r) >= 0.3 ? 'moderate' : 'weak'
  if (strength === 'weak') return 'Your sleep and mood show little connection so far.'
  return `There is a ${strength} ${r > 0 ? 'positive' : 'negative'} link: on days after ${r > 0 ? 'more' : 'less'} sleep, your mood tends to be higher.`
}

// Pairs each night's sleep with the average mood of the day it was logged
function SleepMoodChart() {
  const { sleepEntries, moodEntries } = useHealthData()
  const sleep = dailyValues(sleepEntries, 'hours', 'avg')
  const mood = dailyValues(moodEntries, 'mood', 'avg')
  const points = Object.keys(sleep)
    .filter((date) => date in mood)
    .map((date) => ({ date, hours: sleep[date], mood: Math.round(mood[date] * 10) / 10 }))
  const r = correlation(points.map((p) => p.hours), points.map((p) => p.mood))

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-800 mb-1">Does sleep affect your mood?</h3>
      <p className="text-sm text-gray-600 mb-4">
        {r === null
          ? 'Log sleep and mood on at least 3 days to see how they relate.'
          : `${describe(r)} (r = ${r.toFixed(2)}, ${points.length} days)`}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="hours" name="Sleep" unit=" h" domain={['dataMin - 1', 'dataMax + 1']} />
          <YAxis type="number" dataKey="mood" name="Mood" domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter data={points} fill="#8b5cf6" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

export default SleepMoodChart
