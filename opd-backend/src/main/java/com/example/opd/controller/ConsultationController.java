package com.example.opd.controller;

import com.example.opd.dto.ConsultationRequest;
import com.example.opd.entity.Consultation;
import com.example.opd.service.ConsultationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    // Save vitals + notes and mark the consultation complete
    @PostMapping("/appointment/{appointmentId}/complete")
    @ResponseStatus(HttpStatus.CREATED)
    public Consultation complete(@PathVariable Long appointmentId,
                                 @Valid @RequestBody ConsultationRequest request) {
        return consultationService.complete(appointmentId, request);
    }

    // History: completed consultations of a patient
    @GetMapping("/patient/{patientId}")
    public List<Consultation> history(@PathVariable Long patientId) {
        return consultationService.completedForPatient(patientId);
    }
}
