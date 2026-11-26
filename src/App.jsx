import { useState, useEffect } from 'react'
import { HealthDataProvider } from './context/HealthDataContext'
import MoodTracker from './modules/MoodTracker'
import SleepTracker from './modules/SleepTracker'
import WaterTracker from './modules/WaterTracker'
import ExerciseTracker from './modules/ExerciseTracker'
import MealTracker from './modules/MealTracker'
import DailyGraph from './components/DailyGraph'
import TrendGraph from './components/TrendGraph'
import StatsDashboard from './components/StatsDashboard'
import SleepMoodChart from './components/SleepMoodChart'
import MoodHeatmap from './components/MoodHeatmap'
import HistoryView from './components/HistoryView'
import FileManager from './components/FileManager'

const grid = (children) => <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>

const TABS = {
  overview: {
    label: 'Overview',
    content: (
      <div className="space-y-6">
        <StatsDashboard />
        {grid(<><SleepMoodChart /><MoodHeatmap /></>)}
      </div>
    ),
  },
  mood: {
    label: 'Mood',
    content: grid(<>
      <MoodTracker />
      <DailyGraph />
      <TrendGraph kind="moodEntries" field="mood" mode="avg" title="Average Mood" name="Average Mood (1–5)" domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
    </>),
  },
  sleep: {
    label: 'Sleep',
    content: grid(<>
      <SleepTracker />
      <TrendGraph kind="sleepEntries" field="hours" mode="avg" title="Hours Slept" name="Hours" color="#8b5cf6" domain={[0, 12]} />
    </>),
  },
  water: {
    label: 'Water',
    content: grid(<>
      <WaterTracker />
      <TrendGraph kind="waterEntries" field="ml" mode="sum" title="Water (ml)" name="Water (ml)" color="#0ea5e9" />
    </>),
  },
  exercise: {
    label: 'Exercise',
    content: grid(<>
      <ExerciseTracker />
      <TrendGraph kind="exerciseEntries" field="minutes" mode="sum" title="Exercise Minutes" name="Minutes" color="#10b981" />
    </>),
  },
  meals: {
    label: 'Meals',
    content: grid(<>
      <MealTracker />
      <TrendGraph kind="mealEntries" field="calories" mode="sum" title="Calories Eaten" name="kcal" color="#f59e0b" />
    </>),
  },
  history: { label: 'History', content: <HistoryView /> },
  data: { label: 'Data Management', content: <FileManager /> },
}

function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <HealthDataProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <header className="mb-8 flex justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Health Tracking App
              </h1>
              <p className="text-gray-600">
                Track your mood, sleep, water, exercise and meals over time
              </p>
            </div>
            <button
              onClick={() => setDark(!dark)}
              className="shrink-0 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 shadow text-gray-800"
              aria-label="Toggle dark mode"
            >
              {dark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </header>

          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <nav className="flex flex-wrap gap-x-8">
              {Object.entries(TABS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {TABS[activeTab].content}
        </div>
      </div>
    </HealthDataProvider>
  )
}

export default App
