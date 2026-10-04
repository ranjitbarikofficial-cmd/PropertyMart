package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.service.BidService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bid")
public class BidController {

    @Autowired
    private BidService bs;

    @PostMapping("/place")
    public ResponseEntity<Bid> placeBid(
            HttpSession session,
            @RequestParam Long auctionId,
            @RequestParam Double amount) {

        Long buyerId=(Long)session.getAttribute("id");

        Bid bid = bs.placeBid(buyerId, auctionId, amount);

        if (bid != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bid);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/findbyauctionid/{auctionId}")
    public ResponseEntity<List<Bid>> getByAuctionId(@PathVariable Long auctionId){
        List<Bid> bids =bs.getBidsByAuction(auctionId);
        return ResponseEntity.status(HttpStatus.FOUND).body(bids);
    }

    @GetMapping("/findbybuyerid/{buyerId}")
    public ResponseEntity<List<Bid>> getByBuyerId(@PathVariable Long buyerId){
        List<Bid> bids=bs.getBidsByBuyer(buyerId);
        return ResponseEntity.status(HttpStatus.FOUND).body(bids);
    }

}
