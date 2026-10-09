package com.example.opd.repository;

import com.example.opd.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    boolean existsByPhone(String phone);

    // search by name OR phone (partial, case-insensitive name)
    List<Patient> findByNameContainingIgnoreCaseOrPhoneContaining(String name, String phone);
}
