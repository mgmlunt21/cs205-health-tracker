import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHealthData } from '../context/HealthDataContext'
import { formatDate } from '../utils/helpers'
import { dailyValues, average } from '../utils/stats'

const RANGES = { week: 'Last 7 days', month: 'Last 30 days', year: 'Last 12 months' }

// mode 'avg' averages entries (empty days show no bar); 'sum' totals them (empty days are 0)
function TrendGraph({ kind, field, mode, title, name, color = '#6366f1', domain, ticks }) {
  const { [kind]: entries } = useHealthData()
  const [range, setRange] = useState('week')

  const chartData = useMemo(() => {
    const daily = dailyValues(entries, field, mode)
    const today = new Date()
    const round = (v) => (v === null ? null : Math.round(v * 10) / 10)

    if (range === 'year') {
      return Array.from({ length: 12 }, (_, i) => {
        const month = new Date(today.getFullYear(), today.getMonth() - 11 + i, 1)
        const values = Object.entries(daily)
          .filter(([date]) => {
            const [m, , y] = date.split('/').map(Number)
            return m === month.getMonth() + 1 && y === month.getFullYear()
          })
          .map(([, v]) => v)
        const value = mode === 'avg' ? average(values) : values.reduce((sum, v) => sum + v, 0)
        return { label: month.toLocaleDateString('en-US', { month: 'short' }), value: round(value) }
      })
    }

    const days = range === 'week' ? 7 : 30
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (days - 1 - i))
      const label = range === 'week'
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : `${date.getMonth() + 1}/${date.getDate()}`
      return { label, value: round(daily[formatDate(date)] ?? (mode === 'sum' ? 0 : null)) }
    })
  }, [entries, field, mode, range])

  return (
    <div className="card">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <select value={range} onChange={(e) => setRange(e.target.value)} className="input w-auto mt-0 py-1">
          {Object.entries(RANGES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      {range === 'year' && mode === 'sum' && (
        <p className="text-xs text-gray-500 mb-2">Monthly totals</p>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={domain} ticks={ticks} allowDecimals={false} />
          <Tooltip formatter={(value) => value ?? 'No data'} />
          <Bar dataKey="value" fill={color} name={name} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendGraph
