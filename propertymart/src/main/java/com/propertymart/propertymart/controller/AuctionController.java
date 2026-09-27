package com.propertymart.propertymart.controller;


import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<Auction> createAuction(@RequestBody  Auction auction){
        Auction a=as.addAuction(auction);
        return ResponseEntity.status(HttpStatus.CREATED).body(a);
    }

    @GetMapping("/allauction")
    public ResponseEntity<List<Auction>> getallAuction(){
        List<Auction> allauction=as.findAllAuctions();
        return ResponseEntity.status(HttpStatus.FOUND).body(allauction);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Auction> getAuctionId(@PathVariable Long id){
        Optional<Auction> onea= as.findAuctionById(id);
        if(onea.isPresent()){
            return ResponseEntity.status(HttpStatus.FOUND).body(onea.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Auction> updateAuction(@RequestBody Auction auction,@PathVariable Long id){
        Optional<Auction> aa=as.findAuctionById(id);
        Auction a=aa.get();
        if(aa.isPresent()){
            a.setProperty(auction.getProperty());
            a.setStatus(auction.getStatus());
            a.setStartingPrice(auction.getStartingPrice());
            a.setEndTime(auction.getEndTime());
            a.setStartTime(auction.getStartTime());

            return ResponseEntity.status(HttpStatus.OK).body(a);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @DeleteMapping("delete/{id}2")
    public ResponseEntity<Void> deleteAuction(@PathVariable Long id){
        Optional<Auction> aa=as.findAuctionById(id);
        if(aa.isPresent()){
            as.deleteAuction(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
