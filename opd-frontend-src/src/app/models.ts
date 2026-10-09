export interface Patient {
  id?: number;
  name: string;
  gender: string;
  age: number | null;
  phone: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

export interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  appointmentTime: string;
  status: 'BOOKED' | 'COMPLETED';
}

export interface Consultation {
  id: number;
  appointment: Appointment;
  bloodPressure: string;
  temperature: number;
  notes: string;
  completedAt: string;
}
