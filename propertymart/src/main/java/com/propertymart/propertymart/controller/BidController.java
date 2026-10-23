package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.BidService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bid")
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
public class BidController {

    @Autowired
    private BidService bs;

    @PostMapping("/place")
    public ResponseEntity<Bid> placeBid(
            HttpSession session,
            @RequestParam Long auctionId,
            @RequestParam Double amount) {

        Long buyerId = (Long) session.getAttribute("id");

        System.out.println("BID SESSION ID: " + session.getId());
        System.out.println("BID USER ID: " + buyerId);


        if (buyerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Bid bid = bs.placeBid(buyerId, auctionId, amount);

        if (bid != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(bid);
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/findbyauctionid/{auctionId}")
    public ResponseEntity<List<Bid>> getByAuctionId(@PathVariable Long auctionId){
        List<Bid> bids =bs.getBidsByAuction(auctionId);
        return ResponseEntity.status(HttpStatus.OK).body(bids);
    }

    @GetMapping("/findbybuyerid/{buyerId}")
    public ResponseEntity<List<Bid>> getByBuyerId(@PathVariable Long buyerId){
        List<Bid> bids=bs.getBidsByBuyer(buyerId);
        return ResponseEntity.status(HttpStatus.OK).body(bids);
    }

    @GetMapping("/highest/{auctionId}")
    public ResponseEntity<Double> getHighestBid(
            @PathVariable Long auctionId) {

        Optional<Bid> highestBid = bs.getHighestBid(auctionId);

        if (highestBid.isPresent()) {
            return ResponseEntity.ok(highestBid.get().getAmount());
        }

        return ResponseEntity.notFound().build();
    }

}
