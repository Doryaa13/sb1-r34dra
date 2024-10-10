import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import AddWorkoutForm from './components/AddWorkoutForm'
import WorkoutList from './components/WorkoutList'
import DateSelector from './components/DateSelector'
import DeleteAllButton from './components/DeleteAllButton'
import { Workout, Equipment, WorkoutSession } from './types'
import ErrorBoundary from './components/ErrorBoundary'
import WelcomeScreen from './components/WelcomeScreen'

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const savedEquipment = localStorage.getItem('equipment')
    return savedEquipment ? JSON.parse(savedEquipment) : []
  })
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const savedSessions = localStorage.getItem('sessions')
    return savedSessions ? JSON.parse(savedSessions) : []
  })
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('userName') || ''
  })

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment))
  }, [equipment])

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions))
  }, [sessions])

  const getCurrentSession = () => {
    return sessions.find(session => session.date === currentDate) || { date: currentDate, workouts: [] }
  }

  const updateSession = (updatedWorkouts: Workout[]) => {
    const updatedSessions = sessions.filter(session => session.date !== currentDate)
    setSessions([...updatedSessions, { date: currentDate, workouts: updatedWorkouts }])
  }

  const handleAddEquipment = (name: string) => {
    const newEquipment: Equipment = { id: uuidv4(), name }
    setEquipment([...equipment, newEquipment])
  }

  const handleUpdateSets = (equipmentId: string, sets: number) => {
    const currentSession = getCurrentSession()
    const updatedWorkouts = currentSession.workouts.filter(w => w.equipmentId !== equipmentId)
    if (sets > 0) {
      updatedWorkouts.push({ equipmentId, sets, weight: getLastVisitWeight(equipmentId) })
    }
    updateSession(updatedWorkouts)
  }

  const handleUpdateWeight = (equipmentId: string, weight: number) => {
    const currentSession = getCurrentSession()
    const updatedWorkouts = currentSession.workouts.map(w => 
      w.equipmentId === equipmentId ? { ...w, weight } : w
    )
    updateSession(updatedWorkouts)
  }

  const handleDeleteEquipment = (id: string) => {
    setEquipment(equipment.filter(eq => eq.id !== id))
    setSessions(sessions.map(session => ({
      ...session,
      workouts: session.workouts.filter(w => w.equipmentId !== id)
    })))
  }

  const handleEditEquipmentName = (id: string, newName: string) => {
    setEquipment(equipment.map(eq => 
      eq.id === id ? { ...eq, name: newName } : eq
    ))
  }

  const getLastVisitSets = (equipmentId: string) => {
    const lastSession = [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .find(session => session.date < currentDate && session.workouts.some(w => w.equipmentId === equipmentId))
    return lastSession?.workouts.find(w => w.equipmentId === equipmentId)?.sets || 0
  }

  const getLastVisitWeight = (equipmentId: string) => {
    const lastSession = [...sessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .find(session => session.date < currentDate && session.workouts.some(w => w.equipmentId === equipmentId))
    return lastSession?.workouts.find(w => w.equipmentId === equipmentId)?.weight || 0
  }

  const handleDeleteAll = () => {
    setEquipment([])
    setSessions([])
    setUserName('')
    localStorage.removeItem('equipment')
    localStorage.removeItem('sessions')
    localStorage.removeItem('userName')
  }

  const handleWelcomeComplete = (name: string) => {
    setUserName(name)
    localStorage.setItem('userName', name)
  }

  if (!userName) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8 max-w-2xl relative">
        <div className="absolute top-2 right-2">
          <DeleteAllButton onDeleteAll={handleDeleteAll} />
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">מעקב אימוני כושר</h1>
        <h2 className="text-xl font-semibold mb-4 text-center">היי {userName}</h2>
        <DateSelector
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          sessions={sessions}
        />
        <WorkoutList
          workouts={getCurrentSession().workouts}
          equipment={equipment}
          sessions={sessions}
          onUpdateSets={handleUpdateSets}
          onUpdateWeight={handleUpdateWeight}
          onDeleteEquipment={handleDeleteEquipment}
          onEditEquipmentName={handleEditEquipmentName}
          getLastVisitSets={getLastVisitSets}
          getLastVisitWeight={getLastVisitWeight}
        />
        <AddWorkoutForm onAddEquipment={handleAddEquipment} />
      </div>
    </ErrorBoundary>
  )
}

export default App