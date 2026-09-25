package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepo extends JpaRepository<Property,Long> {
}
