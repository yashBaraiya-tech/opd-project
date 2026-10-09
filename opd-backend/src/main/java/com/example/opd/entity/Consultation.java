package com.example.opd.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultations")
@Getter @Setter @NoArgsConstructor
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // one consultation per appointment
    @OneToOne(optional = false)
    @JoinColumn(name = "appointment_id", unique = true)
    private Appointment appointment;

    // vitals (2 fields)
    private String bloodPressure;   // e.g. 120/80
    private Double temperature;     // in Fahrenheit

    @Column(length = 1000)
    private String notes;

    private LocalDateTime completedAt;
}
