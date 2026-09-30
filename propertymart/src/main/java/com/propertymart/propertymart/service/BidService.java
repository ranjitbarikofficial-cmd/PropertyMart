package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class BidService {

    @Autowired
    private BidRepo br;
    @Autowired
    private AuctionRepo ar;
    @Autowired
    private UserRepo uur;

    public Bid placeBid(Long buyerId, Long auctionId, Double amount) {
        Optional<User> u =uur.findById(buyerId);
        System.out.println(u.get());
        if(!u.isPresent()){
            System.out.println(u.get());
            return null;
        }
        Optional<Auction> a=ar.findById(auctionId);
        System.out.println(a.get());
        if(a.isEmpty()){
            return null;
        }

        Bid bid = new Bid();

        bid.setAmmount(amount);
        bid.setBuyer(u.get());
        bid.setAuction(a.get());
        bid.setBidTime(LocalDateTime.now());

        return br.save(bid);
    }
}
