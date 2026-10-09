import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Appointment, Doctor, Patient } from './models';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <h2>Book Appointment</h2>
    <form class="card" (ngSubmit)="book()" #f="ngForm">
      <select name="patient" [(ngModel)]="patientId" required>
        <option [ngValue]="null">Select patient</option>
        @for (p of patients; track p.id) { <option [ngValue]="p.id">{{ p.name }} ({{ p.phone }})</option> }
      </select>
      <select name="doctor" [(ngModel)]="doctorId" required>
        <option [ngValue]="null">Select doctor</option>
        @for (d of doctors; track d.id) { <option [ngValue]="d.id">{{ d.name }} - {{ d.specialization }}</option> }
      </select>
      <input name="time" type="datetime-local" [(ngModel)]="time" required />
      <button type="submit" [disabled]="f.invalid || !patientId || !doctorId">Book</button>
    </form>
    @if (message) { <p [class]="isError ? 'err' : 'ok'">{{ message }}</p> }

    <h2>Today's Appointments</h2>
    <table>
      <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th>Status</th></tr></thead>
      <tbody>
        @for (a of appointments; track a.id) {
          <tr>
            <td>{{ a.appointmentTime | date: 'shortTime' }}</td>
            <td>{{ a.patient.name }}</td>
            <td>{{ a.doctor.name }}</td>
            <td><span class="badge" [class.done]="a.status === 'COMPLETED'">{{ a.status }}</span></td>
          </tr>
        } @empty {
          <tr><td colspan="4">No appointments today</td></tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: './shared.css',
})
export class AppointmentsComponent implements OnInit {
  patients: Patient[] = [];
  doctors: Doctor[] = [];
  appointments: Appointment[] = [];
  patientId: number | null = null;
  doctorId: number | null = null;
  time = '';
  message = '';
  isError = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPatients().subscribe((l) => (this.patients = l));
    this.api.getDoctors().subscribe((l) => (this.doctors = l));
    this.loadToday();
  }

  loadToday() {
    this.api.getTodayAppointments().subscribe((l) => (this.appointments = l));
  }

  book() {
    this.api
      .bookAppointment({ patientId: this.patientId!, doctorId: this.doctorId!, appointmentTime: this.time })
      .subscribe({
        next: () => {
          this.message = 'Appointment booked'; this.isError = false;
          this.patientId = null; this.doctorId = null; this.time = '';
          this.loadToday();
        },
        error: (e) => { this.message = e.error?.message || 'Booking failed'; this.isError = true; },
      });
  }
}
