import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { loadData, saveData, saveFileHandleInfo } from '../utils/storage'
import { createFile, openFile, writeFile, readFile } from '../utils/fileOperations'
import { EMPTY_DATA, parseData } from '../utils/entries'

const HealthDataContext = createContext()

export function HealthDataProvider({ children }) {
  const [data, setData] = useState(EMPTY_DATA)
  const [isLoaded, setIsLoaded] = useState(false)
  const [fileHandle, setFileHandle] = useState(null)
  const [fileStatus, setFileStatus] = useState('none') // 'none', 'saving', 'saved', 'error'
  const fileHandleRef = useRef(null)

  // Load data on startup. File auto-save is set up from a button click,
  // because browsers only allow file pickers in response to user input.
  useEffect(() => {
    setData(loadData())
    setIsLoaded(true)
  }, [])

  // Auto-save to localStorage and file when data changes
  useEffect(() => {
    if (isLoaded) {
      saveData(data)
      saveToFile()
    }
  }, [data, isLoaded])

  async function saveToFile() {
    const handle = fileHandleRef.current
    if (!handle) return

    setFileStatus('saving')
    const success = await writeFile(handle, {
      ...data,
      lastSaved: new Date().toISOString()
    })
    
    if (success) {
      setFileStatus('saved')
      setTimeout(() => setFileStatus('none'), 2000)
    } else {
      setFileStatus('error')
      setTimeout(() => setFileStatus('none'), 3000)
    }
  }

  async function setupFileHandle() {
    const handle = await createFile()
    if (handle) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      await saveToFile()
      return true
    }
    return false
  }

  async function loadFromFile() {
    const handle = await openFile()
    const fileData = handle && parseData(await readFile(handle))
    if (fileData) {
      fileHandleRef.current = handle
      setFileHandle(handle)
      saveFileHandleInfo(handle)
      setData(fileData)
      return true
    }
    return false
  }

  const addEntry = (kind, entry) => {
    setData(d => ({ ...d, [kind]: [...d[kind], entry] }))
  }

  const updateEntry = (kind, entry) => {
    setData(d => ({ ...d, [kind]: d[kind].map(e => (e.id === entry.id ? entry : e)) }))
  }

  const deleteEntry = (kind, id) => {
    setData(d => ({ ...d, [kind]: d[kind].filter(entry => entry.id !== id) }))
  }

  const updateSettings = (changes) => {
    setData(d => ({ ...d, settings: { ...d.settings, ...changes } }))
  }

  const clearData = () => setData(EMPTY_DATA)

  const exportData = () => {
    return JSON.stringify({ ...data, exportedAt: new Date().toISOString() }, null, 2)
  }

  const importData = (jsonString) => {
    try {
      const parsed = parseData(JSON.parse(jsonString))
      if (parsed) setData(parsed)
      return Boolean(parsed)
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  return (
    <HealthDataContext.Provider
      value={{
        ...data,
        addEntry,
        updateEntry,
        deleteEntry,
        updateSettings,
        clearData,
        exportData,
        importData,
        setupFileHandle,
        loadFromFile,
        fileHandle,
        fileStatus,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  )
}

export function useHealthData() {
  const context = useContext(HealthDataContext)
  if (!context) {
    throw new Error('useHealthData must be used within HealthDataProvider')
  }
  return context
}
