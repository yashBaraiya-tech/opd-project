import { Routes } from '@angular/router';
import { PatientsComponent } from './patients.component';
import { AppointmentsComponent } from './appointments.component';
import { ConsultationComponent } from './consultation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'patients', pathMatch: 'full' },
  { path: 'patients', component: PatientsComponent },
  { path: 'appointments', component: AppointmentsComponent },
  { path: 'consultation', component: ConsultationComponent },
];
