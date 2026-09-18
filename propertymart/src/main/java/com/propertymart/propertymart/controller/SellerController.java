package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.service.SellerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService ss;

    public SellerController(SellerService sellerService) {
        ss = sellerService;
    }

    // Create seller
    @PostMapping("/create")
    public ResponseEntity<Seller> addSeller(@RequestBody Seller seller) {

        Seller savedSeller = ss.addSeller(seller);

        return ResponseEntity.ok(savedSeller);
    }

    // Get all sellers
    @GetMapping("/allseller")
    public ResponseEntity<List<Seller>> findAllSellers() {

        List<Seller> sellers = ss.findAllSellers();

        return ResponseEntity.ok(sellers);
    }

    // Get seller by ID
    @GetMapping("/find/{id}")
    public ResponseEntity<Seller> findSellerById(@PathVariable Long id) {

        Optional<Seller> seller = ss.findSellerById(id);

        if (seller.isPresent()) {
            return ResponseEntity.ok(seller.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Update seller
    @PutMapping("/update/{id}")
    public ResponseEntity<Seller> updateSeller(
            @PathVariable Long id,
            @RequestBody Seller seller) {

        Seller updatedSeller = ss.updateSeller(id, seller);

        if (updatedSeller != null) {
            return ResponseEntity.ok(updatedSeller);
        }

        return ResponseEntity.notFound().build();
    }

    // Delete seller
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) {

        ss.deleteSeller(id);

        return ResponseEntity.noContent().build();
    }
}