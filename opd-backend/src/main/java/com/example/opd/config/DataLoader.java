package com.example.opd.config;

import com.example.opd.entity.Doctor;
import com.example.opd.repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/** Seeds a few doctors on first run so the booking dropdown is not empty. */
@Component
public class DataLoader implements CommandLineRunner {

    private final DoctorRepository doctorRepository;

    public DataLoader(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public void run(String... args) {
        if (doctorRepository.count() == 0) {
            doctorRepository.saveAll(List.of(
                    new Doctor("Dr. Anil Mehta", "General Physician"),
                    new Doctor("Dr. Neha Shah", "Pediatrician"),
                    new Doctor("Dr. Rakesh Patel", "Orthopedic")));
        }
    }
}
