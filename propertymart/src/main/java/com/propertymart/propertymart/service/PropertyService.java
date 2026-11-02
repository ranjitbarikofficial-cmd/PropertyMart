
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.ApprovalStatus;
import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.PropertyRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PropertyService {

    private final PropertyRepo pr;
    private final SellerService ss;
    private final AuctionRepo ar;

    public PropertyService(
            PropertyRepo propertyRepo,
            SellerService sellerService,
            AuctionRepo auctionRepo) {

        pr = propertyRepo;
        ss = sellerService;
        ar = auctionRepo;
    }

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

        if (property.getStatus() == null ||
                property.getStatus().isBlank()) {
            property.setStatus("AVAILABLE");
        }

        property.setApprovalStatus(ApprovalStatus.PENDING);

        return pr.save(property);
    }

    public List<Property> findAllProperties() {
        return pr.findAll();
    }

    public Optional<Property> findPropertyById(Long id) {
        return pr.findById(id);
    }

    public Property updateProperty(Long id, Property property) {

        Optional<Property> existingProperty = pr.findById(id);

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

        return pr.save(p);
    }

    public void deleteProperty(Long id) {

        if (ar.existsByPropertyId(id)) {
            throw new IllegalStateException(
                    "Cannot delete this property because it has an auction."
            );
        }

        pr.deleteById(id);
    }

    public List<Property> findPropertiesBySellerId(Long sellerId) {
        return pr.findBySellerId(sellerId);
    }

    public long countPendingProperties() {
        return pr.countByApprovalStatus(ApprovalStatus.PENDING);
    }

    public Property updatePropertyApproval(
            Long id,
            ApprovalStatus approvalStatus) {

        Optional<Property> existingProperty = pr.findById(id);

        if (existingProperty.isEmpty()) {
            return null;
        }

        if (approvalStatus == null) {
            throw new IllegalArgumentException(
                    "Approval status is required"
            );
        }

        Property property = existingProperty.get();
        property.setApprovalStatus(approvalStatus);

        return pr.save(property);
    }
}
