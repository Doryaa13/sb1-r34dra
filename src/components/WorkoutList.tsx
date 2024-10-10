import React, { useState } from 'react'
import { Plus, Minus, Trash2, BarChart2 } from 'lucide-react'
import Modal from 'react-modal'
import { Workout, Equipment, WorkoutSession } from '../types'
import ProgressGraph from './ProgressGraph'

interface WorkoutListProps {
  workouts: Workout[]
  equipment: Equipment[]
  sessions: WorkoutSession[]
  onUpdateSets: (equipmentId: string, sets: number) => void
  onDeleteEquipment: (id: string) => void
  getLastVisitSets: (equipmentId: string) => number
}

Modal.setAppElement('#root')

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, equipment, sessions, onUpdateSets, onDeleteEquipment, getLastVisitSets }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [equipmentToDelete, setEquipmentToDelete] = useState<Equipment | null>(null)

  const openModal = (eq: Equipment) => {
    setSelectedEquipment(eq)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setSelectedEquipment(null)
  }

  const openDeleteModal = (eq: Equipment) => {
    setEquipmentToDelete(eq)
    setDeleteModalIsOpen(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalIsOpen(false)
    setEquipmentToDelete(null)
  }

  const confirmDelete = () => {
    if (equipmentToDelete) {
      onDeleteEquipment(equipmentToDelete.id)
    }
    closeDeleteModal()
  }

  const getProgressData = (equipmentId: string) => {
    return sessions
      .filter(session => session.workouts.some(w => w.equipmentId === equipmentId && w.sets > 0))
      .map(session => ({
        date: session.date,
        sets: session.workouts.find(w => w.equipmentId === equipmentId)?.sets || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">רשימת מכשירי הכושר</h2>
      {equipment.length === 0 ? (
        <p className="text-gray-500">עדיין לא נוספו מכשירים. הוסף מכשיר כדי להתחיל!</p>
      ) : (
        <ul className="space-y-4">
          {equipment.map((eq) => {
            const workout = workouts.find(w => w.equipmentId === eq.id) || { equipmentId: eq.id, sets: 0 }
            const lastVisitSets = getLastVisitSets(eq.id)
            return (
              <li key={eq.id} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">{eq.name}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateSets(eq.id, Math.max(0, workout.sets - 1))}
                      className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold">סטים {workout.sets}</span>
                    <button
                      onClick={() => onUpdateSets(eq.id, workout.sets + 1)}
                      className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => openModal(eq)}
                      className="p-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                    >
                      <BarChart2 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(eq)}
                      className="p-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>ביקור אחרון: {lastVisitSets} סטים</span>
                </div>
              </li>
            )
          })}
        </ul>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Progress Graph"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedEquipment && (
          <div className="bg-white rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">התקדמות עבור {selectedEquipment.name}</h2>
            <ProgressGraph
              equipmentName={selectedEquipment.name}
              data={getProgressData(selectedEquipment.id)}
            />
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              סגור
            </button>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Confirm Delete"
        className="modal"
        overlayClassName="overlay"
      >
        {equipmentToDelete && (
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">האם למחוק את המכשיר "{equipmentToDelete.name}"?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                לא
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                כן, למחוק
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default WorkoutList