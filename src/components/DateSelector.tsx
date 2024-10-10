import React from 'react'
import DatePicker from 'react-datepicker'
import { Calendar } from 'lucide-react'
import { WorkoutSession } from '../types'
import "react-datepicker/dist/react-datepicker.css"

interface DateSelectorProps {
  currentDate: string
  onDateChange: (date: string) => void
  sessions: WorkoutSession[]
}

const DateSelector: React.FC<DateSelectorProps> = ({ currentDate, onDateChange, sessions }) => {
  const highlightDates = sessions
    .filter(session => session.workouts.some(workout => workout.sets > 0))
    .map(session => new Date(session.date))

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center space-x-2">
        <Calendar className="text-blue-500" />
        <DatePicker
          selected={new Date(currentDate)}
          onChange={(date: Date) => onDateChange(date.toISOString().split('T')[0])}
          dateFormat="yyyy-MM-dd"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          highlightDates={highlightDates}
          dayClassName={(date) => {
            const dateString = date.toISOString().split('T')[0]
            if (sessions.some(session => 
              session.date === dateString && 
              session.workouts.some(workout => workout.sets > 0)
            )) {
              return "text-green-600"
            }
            return undefined
          }}
        />
      </div>
    </div>
  )
}

export default DateSelector