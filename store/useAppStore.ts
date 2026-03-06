import { create } from 'zustand'
import { Profile, Patient, Appointment } from '@/types'

interface AppStore {
  currentUser: Profile | null
  setCurrentUser: (user: Profile | null) => void

  activePatient: Patient | null
  setActivePatient: (patient: Patient | null) => void

  activeAppointment: Appointment | null
  setActiveAppointment: (appointment: Appointment | null) => void

  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  activePatient: null,
  setActivePatient: (patient) => set({ activePatient: patient }),

  activeAppointment: null,
  setActiveAppointment: (appointment) => set({ activeAppointment: appointment }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
