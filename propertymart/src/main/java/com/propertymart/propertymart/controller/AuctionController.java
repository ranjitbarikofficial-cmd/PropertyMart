package com.propertymart.propertymart.controller;


import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auction")
public class AuctionController {

    @Autowired
    private AuctionService as;

    @PostMapping("/create")
    public ResponseEntity<Auction> createAuction(@RequestBody Auction auction) {

        Auction a=as.addAuction(auction);
        return ResponseEntity.status(HttpStatus.CREATED).body(a);
    }

    @GetMapping("/allauction")
    public ResponseEntity<List<Auction>> allAuction(){

        List<Auction> auctions=as.findAllAuctions();
        return ResponseEntity.status(HttpStatus.FOUND).body(auctions);
    }

    @GetMapping("findbyid/{id}")
    public ResponseEntity<Auction> oneAuction(@PathVariable Long id){
        Optional<Auction> auction=as.findAuctionById(id);
        if(auction.isPresent()){
            return ResponseEntity.status(HttpStatus.FOUND).body(auction.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Auction> updateauction(@PathVariable Long id,@RequestBody Auction auction){
        Auction a=as.updateAuction(id,auction);
        if(a!=null) {
            return ResponseEntity.status(HttpStatus.OK).body(a);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteauction(@PathVariable Long id){
        as.deleteAuction(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}