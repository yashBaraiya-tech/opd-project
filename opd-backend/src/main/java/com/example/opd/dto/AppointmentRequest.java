package com.example.opd.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AppointmentRequest(
        @NotNull(message = "Patient is required") Long patientId,
        @NotNull(message = "Doctor is required") Long doctorId,
        @NotNull(message = "Appointment date/time is required") LocalDateTime appointmentTime) {
}
