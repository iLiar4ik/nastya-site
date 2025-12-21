export type UserRole = 'teacher' | 'student'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

