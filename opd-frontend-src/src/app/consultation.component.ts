import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Appointment, Consultation, Patient } from './models';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <h2>Pending Consultations (Today)</h2>
    <table>
      <thead><tr><th>Time</th><th>Patient</th><th>Doctor</th><th></th></tr></thead>
      <tbody>
        @for (a of pending; track a.id) {
          <tr [class.selected]="selected?.id === a.id">
            <td>{{ a.appointmentTime | date: 'shortTime' }}</td>
            <td>{{ a.patient.name }}</td>
            <td>{{ a.doctor.name }}</td>
            <td><button type="button" (click)="select(a)">Start</button></td>
          </tr>
        } @empty {
          <tr><td colspan="4">No pending appointments</td></tr>
        }
      </tbody>
    </table>

    @if (selected) {
      <h2>Consultation: {{ selected.patient.name }}</h2>
      <form class="card" (ngSubmit)="complete()" #f="ngForm">
        <input name="bp" [(ngModel)]="form.bloodPressure" placeholder="Blood Pressure (e.g. 120/80)" required />
        <input name="temp" type="number" step="0.1" [(ngModel)]="form.temperature" placeholder="Temperature (°F)" required />
        <textarea name="notes" [(ngModel)]="form.notes" placeholder="Doctor's notes" rows="3" required></textarea>
        <button type="submit" [disabled]="f.invalid">Mark Complete</button>
      </form>
    }
    @if (message) { <p [class]="isError ? 'err' : 'ok'">{{ message }}</p> }

    <h2>Completed Consultations by Patient</h2>
    <div class="card">
      <select [(ngModel)]="historyPatientId" (ngModelChange)="loadHistory()">
        <option [ngValue]="null">Select patient</option>
        @for (p of patients; track p.id) { <option [ngValue]="p.id">{{ p.name }} ({{ p.phone }})</option> }
      </select>
    </div>
    @if (historyPatientId) {
      <table>
        <thead><tr><th>Date</th><th>Doctor</th><th>BP</th><th>Temp (°F)</th><th>Notes</th></tr></thead>
        <tbody>
          @for (c of history; track c.id) {
            <tr>
              <td>{{ c.completedAt | date: 'medium' }}</td>
              <td>{{ c.appointment.doctor.name }}</td>
              <td>{{ c.bloodPressure }}</td>
              <td>{{ c.temperature }}</td>
              <td>{{ c.notes }}</td>
            </tr>
          } @empty {
            <tr><td colspan="5">No completed consultations</td></tr>
          }
        </tbody>
      </table>
    }
  `,
  styleUrl: './shared.css',
})
export class ConsultationComponent implements OnInit {
  pending: Appointment[] = [];
  patients: Patient[] = [];
  history: Consultation[] = [];
  selected: Appointment | null = null;
  historyPatientId: number | null = null;
  form = { bloodPressure: '', temperature: null as number | null, notes: '' };
  message = '';
  isError = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadPending();
    this.api.getPatients().subscribe((l) => (this.patients = l));
  }

  loadPending() {
    this.api.getTodayAppointments().subscribe(
      (l) => (this.pending = l.filter((a) => a.status === 'BOOKED'))
    );
  }

  select(a: Appointment) {
    this.selected = a;
    this.form = { bloodPressure: '', temperature: null, notes: '' };
    this.message = '';
  }

  complete() {
    if (!this.selected) return;
    this.api.completeConsultation(this.selected.id, this.form).subscribe({
      next: () => {
        this.message = 'Consultation completed'; this.isError = false;
        const pid = this.selected!.patient.id!;
        this.selected = null;
        this.loadPending();
        if (this.historyPatientId === pid) this.loadHistory();
      },
      error: (e) => { this.message = e.error?.message || 'Failed to complete'; this.isError = true; },
    });
  }

  loadHistory() {
    if (!this.historyPatientId) { this.history = []; return; }
    this.api.getPatientHistory(this.historyPatientId).subscribe((l) => (this.history = l));
  }
}
