package com.propertymart.propertymart.controller;


import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.service.AuctionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auction")
public class AuctionController {

    @Autowired
    private AuctionService as;

    public ResponseEntity<Auction> createAuction(@RequestBody  Auction auction){
        return null;
    }

}
