package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bid")
public class BidController {

    @Autowired
    private BidService bs;

    @PostMapping("/place")
    public ResponseEntity<Bid> placeBid(
            @RequestParam Long buyerId,
            @RequestParam Long auctionId,
            @RequestParam Double amount) {

        Bid bid = bs.placeBid(buyerId, auctionId, amount);

        if (bid != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bid);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
