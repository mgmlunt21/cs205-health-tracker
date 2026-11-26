import { useHealthData } from '../context/HealthDataContext'
import { describeEntry } from '../utils/entries'
import { newestFirst } from '../utils/helpers'

function EntryList({ form, emptyText }) {
  const { [form.kind]: entries, deleteEntry } = useHealthData()

  if (entries.length === 0) {
    return <p className="text-gray-500 text-center py-4">{emptyText}</p>
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {[...entries].sort(newestFirst).map((entry) => (
        <div key={entry.id} className={`entry-row ${entry.id === form.editingId ? 'ring-2 ring-indigo-500' : ''}`}>
          <div>
            <span className="font-medium text-gray-800">{describeEntry[form.kind](entry)}</span>
            <span className="text-gray-500 text-sm ml-2">• {entry.date} at {entry.time}</span>
          </div>
          <div className="flex shrink-0">
            <button
              onClick={() => form.startEdit(entry)}
              className="text-indigo-600 dark:text-indigo-400 font-medium text-sm px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (!window.confirm('Delete this entry?')) return
                if (entry.id === form.editingId) form.cancel()
                deleteEntry(form.kind, entry.id)
              }}
              className="text-red-500 hover:text-red-700 font-medium text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default EntryList
