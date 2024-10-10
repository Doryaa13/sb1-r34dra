import React, { useState } from 'react'
import { Plus } from 'lucide-react'

interface AddWorkoutFormProps {
  onAddEquipment: (name: string) => void
}

const AddWorkoutForm: React.FC<AddWorkoutFormProps> = ({ onAddEquipment }) => {
  const [equipmentName, setEquipmentName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (equipmentName.trim()) {
      onAddEquipment(equipmentName.trim())
      setEquipmentName('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <input
          type="text"
          value={equipmentName}
          onChange={(e) => setEquipmentName(e.target.value)}
          placeholder="הכנס שם מכשיר כושר"
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={20} />
        </button>
      </div>
    </form>
  )
}

export default AddWorkoutForm