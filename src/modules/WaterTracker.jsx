import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted } from '../utils/helpers'
import EntryList from '../components/EntryList'
import { useEntryForm, EntryFormFooter } from '../components/EntryForm'

const AMOUNTS_ML = [250, 500, 750]

function WaterTracker() {
  const { waterEntries, settings, updateSettings } = useHealthData()
  const [goalInput, setGoalInput] = useState(String(settings.waterGoalMl))
  const [amount, setAmount] = useState('')
  const form = useEntryForm('waterEntries', {
    fill: (e) => setAmount(String(e.ml)),
    reset: () => setAmount(''),
  })

  const goal = settings.waterGoalMl
  const today = getTodayFormatted()
  const todayTotal = waterEntries.filter(e => e.date === today).reduce((sum, e) => sum + e.ml, 0)
  const progress = Math.min(100, (todayTotal / goal) * 100)
  const newGoal = Number(goalInput)
  const isGoalValid = newGoal >= 250 && newGoal <= 10000 && newGoal !== goal
  const amountNum = Number(amount)

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Water Intake</h2>

      <p className="text-gray-700 mb-2">
        Today: <strong>{todayTotal} ml</strong> of {goal} ml goal {todayTotal >= goal && '🎉'}
      </p>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-sky-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      {!form.editingId && (
        <div className="flex gap-2 mb-4">
          {AMOUNTS_ML.map((ml) => (
            <button
              key={ml}
              onClick={() => form.save({ ml })}
              className="flex-1 py-3 rounded-lg font-semibold bg-sky-500 text-white hover:bg-sky-600 transition-colors"
            >
              + {ml} ml
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.save({ ml: amountNum })
        }}
        className="space-y-4 mb-6"
      >
        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            {form.editingId ? 'Amount (ml)' : 'Other amount (ml), or log an earlier drink'}
          </span>
          <input type="number" min="1" max="5000" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" />
        </label>
        <EntryFormFooter form={form} disabled={!(amountNum >= 1 && amountNum <= 5000)} label="Add water" />
      </form>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateSettings({ waterGoalMl: newGoal })
        }}
        className="flex items-end gap-2 mb-6"
      >
        <label className="flex-1">
          <span className="text-sm font-medium text-gray-700">Daily goal (ml, 250–10000)</span>
          <input type="number" min="250" max="10000" step="50" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} className="input" />
        </label>
        <button disabled={!isGoalValid} className="btn-primary w-auto">Set goal</button>
      </form>

      <EntryList form={form} emptyText="No water logged yet." />
    </div>
  )
}

export default WaterTracker
