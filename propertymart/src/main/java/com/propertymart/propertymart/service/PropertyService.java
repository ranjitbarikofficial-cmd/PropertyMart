package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.repository.PropertyRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepo pr;
    private final SellerService ss;

    public PropertyService(
            PropertyRepo propertyRepo,
            SellerService sellerService) {

        pr = propertyRepo;
        ss = sellerService;
    }

    // Create property
    public Property addProperty(Property property) {

        if (property.getSeller() == null ||
                property.getSeller().getId() == null) {

            return null;
        }

        Long sellerId = property.getSeller().getId();

        Optional<Seller> seller = ss.findSellerById(sellerId);

        if (seller.isEmpty()) {
            return null;
        }

        property.setSeller(seller.get());

        // Default status
        if (property.getStatus() == null ||
                property.getStatus().isBlank()) {

            property.setStatus("AVAILABLE");
        }

        return pr.save(property);
    }

    // Get all properties
    public List<Property> findAllProperties() {
        return pr.findAll();
    }

    // Get property by ID
    public Optional<Property> findPropertyById(Long id) {
        return pr.findById(id);
    }

    // Update property
    public Property updateProperty(Long id, Property property) {

        Optional<Property> existingProperty =
                pr.findById(id);

        if (existingProperty.isEmpty()) {
            return null;
        }

        Property p = existingProperty.get();

        p.setTitle(property.getTitle());
        p.setDescription(property.getDescription());
        p.setPropertyType(property.getPropertyType());
        p.setLocation(property.getLocation());
        p.setArea(property.getArea());
        p.setBedrooms(property.getBedrooms());
        p.setBathrooms(property.getBathrooms());
        p.setBasePrice(property.getBasePrice());
        p.setStatus(property.getStatus());

        // Do NOT change seller during update
        return pr.save(p);
    }

    // Delete property
    public void deleteProperty(Long id) {
        pr.deleteById(id);
    }
    public List<Property> findPropertiesBySellerId(Long sellerId) {
        return pr.findBySellerId(sellerId);
    }
}