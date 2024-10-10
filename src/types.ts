export interface Workout {
  equipmentId: string
  sets: number
  weight: number
}

export interface WorkoutSession {
  date: string
  workouts: Workout[]
}

export interface Equipment {
  id: string
  name: string
}