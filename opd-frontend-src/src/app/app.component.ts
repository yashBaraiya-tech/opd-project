import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <h1>OPD Mini Module</h1>
      <nav>
        <a routerLink="/patients" routerLinkActive="active">Patients</a>
        <a routerLink="/appointments" routerLinkActive="active">Appointments</a>
        <a routerLink="/consultation" routerLinkActive="active">Consultation</a>
      </nav>
    </header>
    <main><router-outlet /></main>
  `,
  styles: [`
    header { background:#0d6efd; color:#fff; padding:12px 24px; display:flex; align-items:center; gap:32px; }
    h1 { margin:0; font-size:20px; }
    nav a { color:#cfe2ff; margin-right:16px; text-decoration:none; padding:6px 10px; border-radius:4px; }
    nav a.active { background:#fff; color:#0d6efd; }
    main { padding:24px; max-width:1000px; margin:auto; }
  `],
})
export class AppComponent {}
