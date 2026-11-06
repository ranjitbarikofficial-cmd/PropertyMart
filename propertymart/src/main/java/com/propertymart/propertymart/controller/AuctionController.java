
package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import com.propertymart.propertymart.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(
        origins = "http://localhost:4200",
        allowCredentials = "true"
)
@RequestMapping("/api/auction")
public class AuctionController {

    @Autowired
    private AuctionService as;

    @PostMapping("/create")
    public ResponseEntity<Auction> createAuction(@RequestBody Auction auction) {
        Auction a = as.addAuction(auction);
        return ResponseEntity.status(HttpStatus.CREATED).body(a);
    }

    @GetMapping("/allauction")
    public ResponseEntity<List<Auction>> allAuction() {
        List<Auction> auctions = as.findAllAuctions();
        return ResponseEntity.ok(auctions);
    }

    @GetMapping({"/find/{id}", "/findbyid/{id}"})
    public ResponseEntity<Auction> oneAuction(@PathVariable Long id) {
        Optional<Auction> auction = as.findAuctionById(id);

        if (auction.isPresent()) {
            return ResponseEntity.ok(auction.get());
        }

        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping({"/user/{userId}", "/seller/{userId}"})
    public ResponseEntity<List<Auction>> getAuctionsBySellerUserId(
            @PathVariable Long userId) {

        List<Auction> auctions = as.findAuctionsBySellerUserId(userId);
        return ResponseEntity.ok(auctions);
    }

    @GetMapping("/won/{buyerId}")
    public ResponseEntity<List<Map<String, Object>>> getWonAuctions(
            @PathVariable Long buyerId) {

        List<Auction> auctions = as.getWonAuctionsByBuyerId(buyerId);

        List<Map<String, Object>> result = auctions.stream()
                .map(auction -> {
                    Map<String, Object> item = new HashMap<>();

                    item.put("id", auction.getId());
                    item.put("startTime", auction.getStartTime());
                    item.put("endTime", auction.getEndTime());
                    item.put("status", auction.getStatus());
                    item.put("startingPrice", auction.getStartingPrice());
                    item.put("property", auction.getProperty());
                    item.put("winner", auction.getWinner());
                    item.put("winningBid",
                            as.getWinningBidAmount(auction.getId()));

                    return item;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @GetMapping("/winners")
    public ResponseEntity<List<Map<String, Object>>> getAllAuctionWinners() {

        List<Auction> auctions = as.findAllAuctions();

        List<Map<String, Object>> result = auctions.stream()
                .filter(auction -> auction.getStatus() == AuctionStatus.ENDED)
                .map(auction -> {
                    Map<String, Object> item = new HashMap<>();

                    item.put("id", auction.getId());
                    item.put("property", auction.getProperty());
                    item.put("startTime", auction.getStartTime());
                    item.put("endTime", auction.getEndTime());
                    item.put("status", auction.getStatus());
                    item.put("startingPrice", auction.getStartingPrice());
                    item.put("winner", auction.getWinner());
                    item.put("winningBid",
                            as.getWinningBidAmount(auction.getId()));

                    return item;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Auction> updateauction(
            @PathVariable Long id,
            @RequestBody Auction auction) {

        Auction a = as.updateAuction(id, auction);
        return ResponseEntity.ok(a);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteauction(@PathVariable Long id) {
        as.deleteAuction(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
