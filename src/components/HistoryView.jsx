import { useHealthData } from '../context/HealthDataContext'
import { ENTRY_KINDS, describeEntry } from '../utils/entries'
import { newestFirst } from '../utils/helpers'

function HistoryView() {
  const health = useHealthData()

  const groupedByDate = {}
  ENTRY_KINDS
    .flatMap(kind => health[kind].map(entry => ({ ...entry, kind })))
    .sort(newestFirst)
    .forEach(entry => {
      (groupedByDate[entry.date] ??= []).push(entry)
    })

  return (
    <div className="card">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">History</h2>
      
      {Object.keys(groupedByDate).length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No history yet. Start logging to see it here.
        </p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate)
            .sort((a, b) => new Date(b[0]) - new Date(a[0]))
            .map(([date, entries]) => (
              <div key={date} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">{date}</h3>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={`${entry.kind}-${entry.id}`}
                      className="entry-row"
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">
                          {describeEntry[entry.kind](entry)}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">
                          • {entry.time}
                        </span>
                      </div>
                      <button
                        onClick={() => window.confirm('Delete this entry?') && health.deleteEntry(entry.kind, entry.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm ml-4 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        title="Delete this entry"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default HistoryView
