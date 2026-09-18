package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.repository.SellerRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SellerService {

    private final SellerRepo sr;

    public SellerService(SellerRepo sellerRepo) {
        sr = sellerRepo;
    }

    // Create seller
    public Seller addSeller(Seller seller) {
        return sr.save(seller);
    }

    // Get all sellers
    public List<Seller> findAllSellers() {
        return sr.findAll();
    }

    // Get seller by ID
    public Optional<Seller> findSellerById(Long id) {
        return sr.findById(id);
    }

    // Update seller
    public Seller updateSeller(Long id, Seller seller) {

        Optional<Seller> existingSeller = sr.findById(id);

        if (existingSeller.isPresent()) {

            Seller s = existingSeller.get();

            s.setName(seller.getName());
            s.setEmail(seller.getEmail());
            s.setPhone(seller.getPhone());

            return sr.save(s);
        }

        return null;
    }

    // Delete seller
    public void deleteSeller(Long id) {
        sr.deleteById(id);
    }
}
