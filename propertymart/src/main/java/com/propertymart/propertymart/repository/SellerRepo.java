package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepo extends JpaRepository<Seller, Long> {
}
