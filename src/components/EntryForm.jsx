import { useState } from 'react'
import { useHealthData } from '../context/HealthDataContext'
import { createEntry, toDateTimeInput } from '../utils/helpers'

// Shared add/edit logic for the tracker forms. `fill` loads an entry into the tracker's own
// fields when editing starts; `reset` clears them after saving or cancelling.
// `when` stays null until the user picks a time, so new entries use the moment they are saved.
export function useEntryForm(kind, { fill, reset }) {
  const { addEntry, updateEntry } = useHealthData()
  const [when, setWhen] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const cancel = () => {
    setEditingId(null)
    setWhen(null)
    reset()
  }

  const save = (fields) => {
    const entry = createEntry(fields, when ? new Date(when) : new Date())
    if (editingId) updateEntry(kind, { ...entry, id: editingId })
    else addEntry(kind, entry)
    cancel()
  }

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setWhen(toDateTimeInput(new Date(entry.timestamp)))
    fill(entry)
  }

  return { kind, when, setWhen, editingId, save, startEdit, cancel }
}

export function EntryFormFooter({ form, disabled, label }) {
  return (
    <>
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Date and time</span>
        <input
          type="datetime-local"
          value={form.when ?? toDateTimeInput(new Date())}
          max={toDateTimeInput(new Date())}
          onChange={(e) => form.setWhen(e.target.value)}
          className="input"
        />
      </label>
      <div className="flex gap-2">
        <button disabled={disabled || form.when === ''} className="btn-primary">
          {form.editingId ? 'Save changes' : label}
        </button>
        {form.editingId && (
          <button type="button" onClick={form.cancel} className="px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700">
            Cancel
          </button>
        )}
      </div>
    </>
  )
}
