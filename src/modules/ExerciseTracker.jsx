import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import EntryList from '../components/EntryList'
import { useEntryForm, EntryFormFooter } from '../components/EntryForm'

const ACTIVITIES = [
  'Walking', 'Running', 'Hiking', 'Cycling', 'Swimming', 'Rowing', 'Elliptical', 'Stair climbing', 'Jump rope',
  'Strength training', 'CrossFit', 'HIIT', 'Yoga', 'Pilates', 'Stretching', 'Dance',
  'Basketball', 'Soccer', 'Football', 'Baseball', 'Softball', 'Volleyball', 'Tennis', 'Pickleball', 'Badminton',
  'Table tennis', 'Golf', 'Hockey', 'Lacrosse', 'Rugby', 'Cricket', 'Boxing', 'Martial arts', 'Wrestling',
  'Climbing', 'Skiing', 'Snowboarding', 'Skating', 'Surfing', 'Kayaking',
]

function ExerciseTracker() {
  const { exerciseEntries } = useHealthData()
  const [type, setType] = useState('')
  const [minutes, setMinutes] = useState('')
  const [calories, setCalories] = useState('')
  const form = useEntryForm('exerciseEntries', {
    fill: (e) => { setType(e.type); setMinutes(String(e.minutes)); setCalories(e.calories === undefined ? '' : String(e.calories)) },
    reset: () => { setType(''); setMinutes(''); setCalories('') },
  })

  const minutesNum = Number(minutes)
  const caloriesNum = Number(calories)
  const isValid = type.trim() && minutesNum >= 1 && minutesNum <= 1440 && caloriesNum >= 0 && caloriesNum <= 5000

  const handleSubmit = (e) => {
    e.preventDefault()
    form.save({
      type: type.trim(),
      minutes: minutesNum,
      ...(calories !== '' && { calories: caloriesNum }),
    })
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Exercise Log</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Activity</span>
          <input
            list="exercise-types"
            maxLength={50}
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Running"
            className="input"
          />
          <datalist id="exercise-types">
            {[...new Set([...exerciseEntries.map(e => e.type), ...ACTIVITIES])].map(t => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Duration (minutes)</span>
            <input type="number" min="1" max="1440" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Calories burned (optional)</span>
            <input type="number" min="0" max="5000" value={calories} onChange={(e) => setCalories(e.target.value)} className="input" />
          </label>
        </div>
        <EntryFormFooter form={form} disabled={!isValid} label="Save workout" />
      </form>
      <EntryList form={form} emptyText="No workouts logged yet." />
    </div>
  )
}

export default ExerciseTracker
