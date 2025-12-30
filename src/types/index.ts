export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  exercises: Exercise[];
  category: WorkoutCategory;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number; // em segundos
  instructions?: string;
}

export type WorkoutCategory = 'Força' | 'Cardio' | 'Flexibilidade' | 'Funcional';

export interface TrainingPlan {
  id: string;
  userId: string;
  name: string;
  workouts: Workout[];
  startDate: Date;
  endDate?: Date;
}
