package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Role;
import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.SellerRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SellerService {

    private final SellerRepo sr;
    private final UserRepo ur;

    public SellerService(SellerRepo sellerRepo, UserRepo userRepo) {
        sr = sellerRepo;
        ur = userRepo;
    }

    public Seller addSeller(Seller seller) {

        if (seller.getUser() == null || seller.getUser().getId() == null) {
            throw new RuntimeException("User ID is required");
        }

        User user = ur.findById(seller.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only SELLER users can have a Seller profile
        if (user.getRole() != Role.SELLER) {
            throw new RuntimeException(
                    "User must have SELLER role"
            );
        }

        // Take seller information from the User
        seller.setUser(user);
        seller.setName(user.getName());
        seller.setEmail(user.getEmail());
        seller.setPhone(user.getPhone());

        return sr.save(seller);
    }

    public List<Seller> findAllSellers() {
        return sr.findAll();
    }

    public Optional<Seller> findSellerById(Long id) {
        return sr.findById(id);
    }

    public Optional<Seller> findSellerByUserId(Long userId) {
        return sr.findByUserId(userId);
    }

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

    public void deleteSeller(Long id) {
        sr.deleteById(id);
    }
}