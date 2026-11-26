# Health Tracking App

A personal wellness tracker for mood, sleep, water, exercise and meals, with charts, statistics and a dark mode. It started as the UCR CS205 (Fall 2026) mood-tracker starter and was extended with AI coding agents (see [AI_USAGE.md](AI_USAGE.md)).

Everything runs in the browser. Data is saved to `localStorage`, can be exported and imported as JSON, and can optionally auto-save to a file. There is no backend and no account.

## Features

**Trackers** (each has its own tab, form, entry list and trend chart)

| Tracker | What you log | Extras |
|---------|--------------|--------|
| Mood | 1 to 5 rating | Optional journal note; today's mood line chart |
| Sleep | Bedtime, wake time, quality 1 to 5 | Hours are worked out for you, including nights that cross midnight |
| Water | Quick +250/500/750 ml buttons or any amount | Editable daily goal with a progress bar |
| Exercise | Activity and minutes | Optional calories; suggestions for 40 activities plus anything you've logged before |
| Meals | Meal name and calories | Autocompletes meals you've eaten before and fills in their calories |

Every entry can be **logged for a past date and time**, **edited** or **deleted**.

**Analytics**
- **Overview tab:** daily averages and current streaks for each tracker, best and worst mood days, and how many days the water goal was met.
- **Sleep vs mood:** a scatter chart of each night's sleep against that day's mood, with the correlation explained in plain English.
- **Mood calendar:** a month-by-month heatmap colored by average mood.
- **Trend charts:** every tracker has a bar chart with last 7 days, last 30 days and last 12 months views.
- **History tab:** all entries from every tracker, grouped by date.

**Data and UX**
- Import and export JSON. Every entry is validated before import (real dates, values in range, text length limits), and old mood-only files still import.
- Optional auto-save to a file you pick (Chrome and Edge).
- "Load Sample Data" fills in 60 days of made-up entries for trying out the charts.
- Dark mode toggle, remembered between visits.

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev      # start at http://localhost:5173
npm test         # run the unit tests
npm run build    # production build in dist/
```

## Project structure

```
src/
├── App.jsx                     # Tabs, layout and dark mode toggle
├── context/
│   └── HealthDataContext.jsx   # Central store: add, update, delete entries; import/export; file auto-save
├── modules/                    # One form per tracker
│   ├── MoodTracker.jsx
│   ├── SleepTracker.jsx
│   ├── WaterTracker.jsx
│   ├── ExerciseTracker.jsx
│   └── MealTracker.jsx
├── components/
│   ├── EntryForm.jsx           # Shared add/edit logic and the date/time + save controls
│   ├── EntryList.jsx           # Entry list with edit and delete
│   ├── RatingPicker.jsx        # 1 to 5 button row (mood, sleep quality)
│   ├── DailyGraph.jsx          # Today's mood
│   ├── TrendGraph.jsx          # Week / month / year bar chart for any tracker
│   ├── StatsDashboard.jsx      # Averages, streaks, best/worst days
│   ├── SleepMoodChart.jsx      # Sleep vs mood correlation
│   ├── MoodHeatmap.jsx         # Mood calendar
│   ├── HistoryView.jsx         # All entries by date
│   └── FileManager.jsx         # Import, export, sample data, auto-save
├── utils/
│   ├── entries.js              # Data schema, validation (parseData) and entry labels
│   ├── stats.js                # Daily totals/averages, streaks, correlation
│   ├── helpers.js              # Dates and createEntry
│   ├── sampleData.js           # Demo data generator
│   ├── storage.js              # localStorage
│   ├── fileOperations.js       # File System Access API
│   └── *.test.js               # Vitest unit tests
└── index.css                   # Tailwind plus shared component classes and dark mode
```

## Data format

Every entry has an `id`, an ISO `timestamp`, and a local `date` (M/D/YYYY) and `time`. Any list, and `settings`, can be left out of an import file.

```json
{
  "settings": { "waterGoalMl": 2000 },
  "moodEntries": [
    { "id": 1705334400000, "mood": 4, "note": "Optional", "timestamp": "2024-01-15T20:00:00.000Z", "time": "12:00 PM", "date": "1/15/2024" }
  ],
  "sleepEntries": [
    { "id": 1705330800000, "hours": 7.5, "quality": 4, "bedtime": "23:30", "wakeTime": "07:00", "timestamp": "2024-01-15T15:00:00.000Z", "time": "7:00 AM", "date": "1/15/2024" }
  ],
  "waterEntries": [
    { "id": 1705338000000, "ml": 500, "timestamp": "2024-01-15T17:00:00.000Z", "time": "9:00 AM", "date": "1/15/2024" }
  ],
  "exerciseEntries": [
    { "id": 1705348800000, "type": "Running", "minutes": 30, "calories": 300, "timestamp": "2024-01-15T20:00:00.000Z", "time": "12:00 PM", "date": "1/15/2024" }
  ],
  "mealEntries": [
    { "id": 1705352400000, "name": "Lunch", "calories": 650, "timestamp": "2024-01-15T21:00:00.000Z", "time": "1:00 PM", "date": "1/15/2024" }
  ]
}
```

Validation rules: mood and sleep quality are whole numbers from 1 to 5, sleep is 0 to 24 hours, water is 1 to 5000 ml, exercise is 1 to 1440 minutes, calories are 0 to 5000, names are up to 50 characters, notes up to 280, and the water goal is 250 to 10000 ml. `example-data.json` is a small valid example.

## Tech stack

React 18, Vite, Tailwind CSS, Recharts, Vitest.

## License

Educational project for UCR CS205 (Fall 2026).
