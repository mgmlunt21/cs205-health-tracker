import { useState } from 'react'
import RatingPicker from '../components/RatingPicker'
import EntryList from '../components/EntryList'
import { useEntryForm, EntryFormFooter } from '../components/EntryForm'

const toMinutes = (time) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function SleepTracker() {
  const [bedtime, setBedtime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState(null)
  const form = useEntryForm('sleepEntries', {
    fill: (e) => { setBedtime(e.bedtime ?? '23:00'); setWakeTime(e.wakeTime ?? '07:00'); setQuality(e.quality) },
    reset: () => setQuality(null),
  })

  // Handles nights that cross midnight, e.g. 23:00 → 07:00 is 8 h
  const hours = bedtime && wakeTime
    ? Math.round(((toMinutes(wakeTime) - toMinutes(bedtime) + 1440) % 1440) / 6) / 10
    : null

  const handleSubmit = (e) => {
    e.preventDefault()
    form.save({ hours, quality, bedtime, wakeTime })
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sleep Tracker</h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Bedtime</span>
            <input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="input" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Wake time</span>
            <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="input" />
          </label>
        </div>
        {hours !== null && <p className="text-gray-700">That&apos;s <strong>{hours} hours</strong> of sleep.</p>}
        <div>
          <span className="text-sm font-medium text-gray-700">Sleep quality (1 = poor, 5 = great)</span>
          <div className="mt-1">
            <RatingPicker value={quality} onChange={setQuality} />
          </div>
        </div>
        <EntryFormFooter form={form} disabled={hours === null || !quality} label="Save sleep" />
      </form>
      <EntryList form={form} emptyText="No sleep logged yet." />
    </div>
  )
}

export default SleepTracker
