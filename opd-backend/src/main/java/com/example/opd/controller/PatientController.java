package com.example.opd.controller;

import com.example.opd.entity.Patient;
import com.example.opd.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Patient register(@Valid @RequestBody Patient patient) {
        return patientService.register(patient);
    }

    // GET /api/patients            -> all
    // GET /api/patients?q=raj      -> search by name or phone
    @GetMapping
    public List<Patient> list(@RequestParam(required = false) String q) {
        return patientService.list(q);
    }
}
