package com.example.opd.service;

import com.example.opd.dto.AppointmentRequest;
import com.example.opd.entity.*;
import com.example.opd.repository.AppointmentRepository;
import com.example.opd.repository.DoctorRepository;
import com.example.opd.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public Appointment book(AppointmentRequest req) {
        Patient patient = patientRepository.findById(req.patientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));
        Doctor doctor = doctorRepository.findById(req.doctorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found"));

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentTime(req.appointmentTime());
        appt.setStatus(AppointmentStatus.BOOKED);
        return appointmentRepository.save(appt);
    }

    public List<Appointment> today() {
        LocalDate today = LocalDate.now();
        return appointmentRepository.findByAppointmentTimeBetweenOrderByAppointmentTimeAsc(
                today.atStartOfDay(), today.plusDays(1).atStartOfDay().minusNanos(1));
    }
}
