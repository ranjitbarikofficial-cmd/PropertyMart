package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.service.PropertyService;
import com.propertymart.propertymart.service.SellerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final PropertyService propertyService;
    private final SellerService sellerService;

    public AdminDashboardController(
            PropertyService propertyService,
            SellerService sellerService) {
        this.propertyService = propertyService;
        this.sellerService = sellerService;
    }

    @GetMapping("/pending-approvals")
    public Map<String, Long> getPendingApprovals() {
        long pendingProperties = propertyService.countPendingProperties();
        long pendingSellers = sellerService.countPendingSellers();

        return Map.of(
                "pendingProperties", pendingProperties,
                "pendingSellers", pendingSellers,
                "totalPendingApprovals", pendingProperties + pendingSellers
        );
    }
}