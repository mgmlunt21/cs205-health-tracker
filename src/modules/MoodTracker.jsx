import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { newestFirst } from '../utils/helpers'
import { MOOD_LABELS } from '../utils/entries'
import RatingPicker from '../components/RatingPicker'
import EntryList from '../components/EntryList'
import { useEntryForm, EntryFormFooter } from '../components/EntryForm'

function MoodTracker() {
  const { moodEntries } = useHealthData()
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const form = useEntryForm('moodEntries', {
    fill: (e) => { setSelectedMood(e.mood); setNote(e.note ?? '') },
    reset: () => { setSelectedMood(null); setNote('') },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    form.save({ mood: selectedMood, ...(note.trim() && { note: note.trim() }) })
  }

  const latestEntry = [...moodEntries].sort(newestFirst)[0]

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Mood Tracker
      </h2>
      <p className="text-gray-600 mb-4">
        Select how you&apos;re feeling and then submit. The date and time default to now.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <RatingPicker value={selectedMood} onChange={setSelectedMood} labels={MOOD_LABELS} />
        <label className="block">
          <span className="text-sm font-medium text-gray-700">Journal note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={280}
            rows={2}
            placeholder="What's on your mind?"
            className="input"
          />
        </label>
        <EntryFormFooter form={form} disabled={!selectedMood} label="Save how I feel" />
      </form>

      {latestEntry && (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Last recorded mood:</p>
          <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            {latestEntry.mood} – {MOOD_LABELS[latestEntry.mood]}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {latestEntry.date} at {latestEntry.time}
          </p>
        </div>
      )}

      <EntryList form={form} emptyText="No moods logged yet. Choose how you feel to get started." />
    </div>
  )
}

export default MoodTracker
