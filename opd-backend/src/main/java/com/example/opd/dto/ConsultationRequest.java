package com.example.opd.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ConsultationRequest(
        @NotBlank(message = "Blood pressure is required") String bloodPressure,
        @NotNull(message = "Temperature is required") Double temperature,
        @NotBlank(message = "Notes are required") String notes) {
}
