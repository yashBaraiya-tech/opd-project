import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from './api.service';
import { Patient } from './models';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h2>Register Patient</h2>
    <form class="card" (ngSubmit)="save()" #f="ngForm">
      <input name="name" [(ngModel)]="patient.name" placeholder="Name" required />
      <select name="gender" [(ngModel)]="patient.gender" required>
        <option value="">Gender</option>
        <option>Male</option><option>Female</option><option>Other</option>
      </select>
      <input name="age" type="number" min="0" max="150" [(ngModel)]="patient.age" placeholder="Age" required />
      <input name="phone" [(ngModel)]="patient.phone" placeholder="Phone (10 digits)" required />
      <button type="submit" [disabled]="f.invalid">Add Patient</button>
    </form>
    @if (message) { <p [class]="isError ? 'err' : 'ok'">{{ message }}</p> }

    <h2>Patients</h2>
    <input class="search" [(ngModel)]="query" (ngModelChange)="load()" placeholder="Search by name or phone..." />
    <table>
      <thead><tr><th>#</th><th>Name</th><th>Gender</th><th>Age</th><th>Phone</th></tr></thead>
      <tbody>
        @for (p of patients; track p.id) {
          <tr><td>{{ p.id }}</td><td>{{ p.name }}</td><td>{{ p.gender }}</td><td>{{ p.age }}</td><td>{{ p.phone }}</td></tr>
        } @empty {
          <tr><td colspan="5">No patients found</td></tr>
        }
      </tbody>
    </table>
  `,
  styleUrl: './shared.css',
})
export class PatientsComponent implements OnInit {
  patient: Patient = { name: '', gender: '', age: null, phone: '' };
  patients: Patient[] = [];
  query = '';
  message = '';
  isError = false;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getPatients(this.query.trim()).subscribe((list) => (this.patients = list));
  }

  save() {
    this.api.addPatient(this.patient).subscribe({
      next: (p) => {
        this.show(`Patient "${p.name}" registered`, false);
        this.patient = { name: '', gender: '', age: null, phone: '' };
        this.load();
      },
      error: (e) => this.show(e.error?.message || 'Failed to save patient', true),
    });
  }

  private show(msg: string, err: boolean) { this.message = msg; this.isError = err; }
}
