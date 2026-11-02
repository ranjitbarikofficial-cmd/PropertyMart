
package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.ApprovalStatus;
import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.service.PropertyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
@RequestMapping("/api/property")
public class PropertyController {

    private final PropertyService ps;

    public PropertyController(PropertyService propertyService) {
        ps = propertyService;
    }

    @PostMapping("/create")
    public ResponseEntity<Property> addProperty(
            @RequestBody Property property) {

        Property savedProperty = ps.addProperty(property);

        if (savedProperty != null) {
            return ResponseEntity.ok(savedProperty);
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/allproperty")
    public ResponseEntity<List<Property>> findAllProperties() {
        return ResponseEntity.ok(ps.findAllProperties());
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Property> findPropertyById(
            @PathVariable Long id) {

        Optional<Property> property = ps.findPropertyById(id);

        return property.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable Long id) {

        try {
            ps.deleteProperty(id);
            return ResponseEntity.noContent().build();

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Property>> findPropertiesBySeller(
            @PathVariable Long sellerId) {

        return ResponseEntity.ok(
                ps.findPropertiesBySellerId(sellerId)
        );
    }

    @PutMapping("/approval/{id}")
    public ResponseEntity<Property> updatePropertyApproval(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String status = request.get("approvalStatus");

        if (status == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            ApprovalStatus approvalStatus =
                    ApprovalStatus.valueOf(status.toUpperCase());

            Property updatedProperty =
                    ps.updatePropertyApproval(id, approvalStatus);

            if (updatedProperty != null) {
                return ResponseEntity.ok(updatedProperty);
            }

            return ResponseEntity.notFound().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
