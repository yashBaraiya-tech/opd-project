package com.example.opd.service;

import com.example.opd.entity.Patient;
import com.example.opd.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient register(Patient patient) {
        if (patientRepository.existsByPhone(patient.getPhone())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A patient with this phone number already exists");
        }
        patient.setId(null); // always insert a new row
        return patientRepository.save(patient);
    }

    public List<Patient> list(String q) {
        if (q == null || q.isBlank()) {
            return patientRepository.findAll();
        }
        String term = q.trim();
        return patientRepository.findByNameContainingIgnoreCaseOrPhoneContaining(term, term);
    }
}
