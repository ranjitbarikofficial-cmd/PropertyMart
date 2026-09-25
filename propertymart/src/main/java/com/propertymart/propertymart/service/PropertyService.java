package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.repository.PropertyRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepo pr;
    @Autowired
    private SellerService ss;

    public PropertyService(PropertyRepo propertyRepo) {
        pr = propertyRepo;
    }

    // Create property
    public Property addProperty(Property property) {
        Long id=property.getSeller().getId();
        Optional<Seller> s=ss.findSellerById(id);
       if (s.isPresent()){
           property.setSeller(s.get());
       }else{
           return null;
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

        Optional<Property> existingProperty = pr.findById(id);

        if (existingProperty.isPresent()) {

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
            p.setSeller(property.getSeller());

            return pr.save(p);
        }

        return null;
    }

    // Delete property
    public void deleteProperty(Long id) {
        pr.deleteById(id);
    }
}
