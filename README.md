# OPD Mini Module (Spring Boot + JPA + Angular + MySQL)

Patient Registration -> Appointment Booking -> Doctor Consultation.

## Folder layout
```
opd-project/
├── opd-backend/            Spring Boot 3 (Java 17) + JPA + MySQL
└── opd-frontend-src/src/app/   Angular source files (copy into a fresh Angular app)
```

## 1. Run the backend
Prerequisites: JDK 17, Maven, MySQL running on localhost:3306.

1. Edit `opd-backend/src/main/resources/application.properties` -> set your MySQL username/password.
   The database `opd_db` is auto-created; tables are auto-created by Hibernate (`ddl-auto=update`).
2. Lombok: in IntelliJ enable *Annotation Processing* (Settings > Build > Compiler > Annotation Processors) and install the Lombok plugin (bundled in recent versions). Eclipse/STS: install Lombok.
3. Run:
   ```
   cd opd-backend
   mvn spring-boot:run
   ```
   API is on http://localhost:8080. Three doctors are seeded on first start.

## 2. Run the frontend
Prerequisites: Node 18+.

```
npx @angular/cli@18 new opd-frontend --routing --style=css --skip-git
cd opd-frontend
```
Copy every file from `opd-frontend-src/src/app/` into `opd-frontend/src/app/`, **overwriting** the generated
`app.component.ts`, `app.config.ts`, `app.routes.ts`. Delete the generated `app.component.html/css/spec.ts` files.

```
ng serve
```
Open http://localhost:4200.

## 3. REST API

| Method | URL | Purpose |
|---|---|---|
| POST | /api/patients | Register patient `{name, gender, age, phone}` |
| GET | /api/patients?q=term | List / search by name or phone |
| GET | /api/doctors | List doctors (seeded) |
| POST | /api/appointments | Book `{patientId, doctorId, appointmentTime}` |
| GET | /api/appointments/today | Today's appointments |
| POST | /api/consultations/appointment/{id}/complete | Save `{bloodPressure, temperature, notes}` + mark complete |
| GET | /api/consultations/patient/{patientId} | Completed consultations of a patient |

Quick test with curl:
```
curl -X POST localhost:8080/api/patients -H "Content-Type: application/json" \
  -d '{"name":"Ravi Shah","gender":"Male","age":34,"phone":"9876543210"}'
curl "localhost:8080/api/patients?q=ravi"
curl -X POST localhost:8080/api/appointments -H "Content-Type: application/json" \
  -d '{"patientId":1,"doctorId":1,"appointmentTime":"2026-10-09T11:30:00"}'
curl localhost:8080/api/appointments/today
curl -X POST localhost:8080/api/consultations/appointment/1/complete -H "Content-Type: application/json" \
  -d '{"bloodPressure":"120/80","temperature":98.6,"notes":"Viral fever, rest + paracetamol"}'
curl localhost:8080/api/consultations/patient/1
```

## 4. Data model
```
Patient (id, name, gender, age, phone[unique])
Doctor  (id, name, specialization)
Appointment (id, patient_id -> Patient, doctor_id -> Doctor, appointmentTime, status BOOKED|COMPLETED)
Consultation (id, appointment_id -> Appointment [1:1, unique], bloodPressure, temperature, notes, completedAt)
```

## 5. Code flow (for review)
Layered architecture: **Controller -> Service -> Repository -> MySQL**.
- Controller: maps HTTP to Java, `@Valid` validates the body.
- Service: business rules (duplicate phone, patient/doctor must exist, one consultation per appointment).
- Repository: Spring Data JPA interfaces; queries are derived from method names
  (e.g. `findByNameContainingIgnoreCaseOrPhoneContaining` -> `WHERE LOWER(name) LIKE %x% OR phone LIKE %x%`).
- Entities: map to tables. DTO records (`AppointmentRequest`, `ConsultationRequest`) carry only the input needed.
- `GlobalExceptionHandler` + `ResponseStatusException` return `{"message": "..."}` so the UI can show errors.
- `CorsConfig` lets Angular (port 4200) call the API (port 8080).

## 6. Functional flow
1. **Register**: Patients screen -> POST /api/patients. Duplicate phone -> 409.
2. **Book**: Appointments screen picks patient + doctor + date/time -> POST /api/appointments (status BOOKED). Today's list = appointments between 00:00 and 23:59 today.
3. **Consult**: Consultation screen shows today's BOOKED appointments -> doctor clicks Start -> enters BP, temperature, notes -> POST .../complete.
   In **one `@Transactional`** method the consultation row is saved and the appointment becomes COMPLETED, so they can never go out of sync. Completing twice -> 409.
4. **History**: choose a patient -> GET /api/consultations/patient/{id}, newest first.

## 7. Likely review questions
- *Why DTO records for requests?* Avoid exposing/accepting full entities; keeps validation per use case.
- *Why `@Transactional` in `complete()`?* Two writes (consultation + appointment status) must succeed or fail together.
- *Why one-to-one with unique column?* DB-level guarantee of a single consultation per appointment.
- *Why `ddl-auto=update`?* Fast for a demo; use Flyway/Liquibase in production.
- *What would you add next?* JWT login (Spring Security), pagination, doctor-wise filtering, unit tests (MockMvc/Mockito), reports.

## Screenshots

### Patient Registration
<img src="Screenshot 2026-10-09 152714.png"
     alt=""
     width="700">

### Appointment Booking
<img src="Screenshot 2026-10-09 152812.png"
     alt=""
     width="700">

### consultin
<img src="Screenshot 2026-10-09 152909.png"
     alt=""
     width="700">

