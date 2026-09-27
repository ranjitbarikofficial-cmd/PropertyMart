package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerRepo extends JpaRepository<Seller, Long> {

    Optional<Seller> findByUserId(Long userId);
}