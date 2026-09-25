package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/property")
public class PropertyController {

    private final PropertyService ps;

    public PropertyController(PropertyService propertyService) {
        ps = propertyService;
    }

    // Create property
    @PostMapping("/create")
    public ResponseEntity<Property> addProperty(@RequestBody Property property) {

        Property savedProperty = ps.addProperty(property);

        return ResponseEntity.ok(savedProperty);
    }

    // Get all properties
    @GetMapping("/allproperty")
    public ResponseEntity<List<Property>> findAllProperties() {

        List<Property> properties = ps.findAllProperties();

        return ResponseEntity.ok(properties);
    }

    // Get property by ID
    @GetMapping("/find/{id}")
    public ResponseEntity<Property> findPropertyById(@PathVariable Long id) {

        Optional<Property> property = ps.findPropertyById(id);

        if (property.isPresent()) {
            return ResponseEntity.ok(property.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Update property
    @PutMapping("/update/{id}")
    public ResponseEntity<Property> updateProperty(
            @PathVariable Long id,
            @RequestBody Property property) {

        Property updatedProperty = ps.updateProperty(id, property);

        if (updatedProperty != null) {
            return ResponseEntity.ok(updatedProperty);
        }

        return ResponseEntity.notFound().build();
    }

    // Delete property
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProperty(@PathVariable Long id) {

        ps.deleteProperty(id);

        return ResponseEntity.noContent().build();
    }
}
