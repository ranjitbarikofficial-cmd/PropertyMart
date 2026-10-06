package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PropertyRepo extends JpaRepository<Property, Long> {

    List<Property> findBySellerId(Long sellerId);
}