import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment, Consultation, Doctor, Patient } from './models';

const BASE = 'http://localhost:8080/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // Patients
  addPatient(p: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${BASE}/patients`, p);
  }
  getPatients(q = ''): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${BASE}/patients`, { params: q ? { q } : {} });
  }

  // Doctors
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${BASE}/doctors`);
  }

  // Appointments
  bookAppointment(body: { patientId: number; doctorId: number; appointmentTime: string }): Observable<Appointment> {
    return this.http.post<Appointment>(`${BASE}/appointments`, body);
  }
  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${BASE}/appointments/today`);
  }

  // Consultations
  completeConsultation(
    appointmentId: number,
    body: { bloodPressure: string; temperature: number | null; notes: string }
  ): Observable<Consultation> {
    return this.http.post<Consultation>(`${BASE}/consultations/appointment/${appointmentId}/complete`, body);
  }
  getPatientHistory(patientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${BASE}/consultations/patient/${patientId}`);
  }
}
