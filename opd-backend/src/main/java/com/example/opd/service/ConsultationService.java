package com.example.opd.service;

import com.example.opd.dto.ConsultationRequest;
import com.example.opd.entity.Appointment;
import com.example.opd.entity.AppointmentStatus;
import com.example.opd.entity.Consultation;
import com.example.opd.repository.AppointmentRepository;
import com.example.opd.repository.ConsultationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    public ConsultationService(ConsultationRepository consultationRepository,
                               AppointmentRepository appointmentRepository) {
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    /** Save vitals + notes and mark both the consultation and appointment complete (one transaction). */
    @Transactional
    public Consultation complete(Long appointmentId, ConsultationRequest req) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (appt.getStatus() == AppointmentStatus.COMPLETED
                || consultationRepository.existsByAppointmentId(appointmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Consultation already completed for this appointment");
        }

        Consultation c = new Consultation();
        c.setAppointment(appt);
        c.setBloodPressure(req.bloodPressure());
        c.setTemperature(req.temperature());
        c.setNotes(req.notes());
        c.setCompletedAt(LocalDateTime.now());

        appt.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appt);
        return consultationRepository.save(c);
    }

    public List<Consultation> completedForPatient(Long patientId) {
        return consultationRepository.findByAppointmentPatientIdOrderByCompletedAtDesc(patientId);
    }
}
