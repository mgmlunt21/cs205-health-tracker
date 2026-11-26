import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { getTodayFormatted, newestFirst } from '../utils/helpers'
import EntryList from '../components/EntryList'
import { useEntryForm, EntryFormFooter } from '../components/EntryForm'

function MealTracker() {
  const { mealEntries } = useHealthData()
  const [name, setName] = useState('')
  const [calories, setCalories] = useState('')
  const form = useEntryForm('mealEntries', {
    fill: (e) => { setName(e.name); setCalories(String(e.calories)) },
    reset: () => { setName(''); setCalories('') },
  })

  const caloriesNum = Number(calories)
  const isValid = name.trim() && calories !== '' && caloriesNum >= 0 && caloriesNum <= 5000
  const today = getTodayFormatted()
  const todayTotal = mealEntries.filter((e) => e.date === today).reduce((sum, e) => sum + e.calories, 0)

  // Most recent calories for each meal name logged before, for autocomplete
  const knownMeals = new Map([...mealEntries].sort(newestFirst).reverse().map((e) => [e.name.toLowerCase(), e]))

  const handleNameChange = (value) => {
    setName(value)
    const known = knownMeals.get(value.trim().toLowerCase())
    if (known) setCalories(String(known.calories))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    form.save({ name: name.trim(), calories: caloriesNum })
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Meal Tracker</h2>
      <p className="text-gray-700 mb-4">Today: <strong>{todayTotal} kcal</strong></p>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Meal</span>
            <input list="known-meals" maxLength={50} value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Chicken salad" className="input" />
            <datalist id="known-meals">
              {[...knownMeals.values()].map((e) => <option key={e.name} value={e.name}>{e.calories} kcal</option>)}
            </datalist>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Calories</span>
            <input type="number" min="0" max="5000" value={calories} onChange={(e) => setCalories(e.target.value)} className="input" />
          </label>
        </div>
        <EntryFormFooter form={form} disabled={!isValid} label="Save meal" />
      </form>
      <EntryList form={form} emptyText="No meals logged yet." />
    </div>
  )
}

export default MealTracker
