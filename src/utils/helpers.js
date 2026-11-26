export function formatDate(date) {
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
}

export function getTodayFormatted() {
  return formatDate(new Date())
}

// `when` is when the thing happened, which can be in the past; the id is always unique
export function createEntry(fields, when = new Date()) {
  return {
    id: Date.now(),
    timestamp: when.toISOString(),
    date: formatDate(when),
    time: when.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    ...fields,
  }
}

// Local 'YYYY-MM-DDTHH:mm', the format <input type="datetime-local"> uses
export function toDateTimeInput(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

export const newestFirst = (a, b) => b.timestamp.localeCompare(a.timestamp)
