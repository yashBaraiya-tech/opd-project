package com.example.opd.controller;

import com.example.opd.dto.AppointmentRequest;
import com.example.opd.entity.Appointment;
import com.example.opd.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment book(@Valid @RequestBody AppointmentRequest request) {
        return appointmentService.book(request);
    }

    @GetMapping("/today")
    public List<Appointment> today() {
        return appointmentService.today();
    }
}
