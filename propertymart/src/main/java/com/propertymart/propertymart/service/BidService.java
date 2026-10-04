package com.propertymart.propertymart.service;

import com.propertymart.propertymart.Exception.BidException;
import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

        if(!u.isPresent()){

            throw new BidException("Buyer not found");
        }
        Optional<Auction> a=ar.findById(auctionId);

        if(a.isEmpty()){
            throw new BidException("Auction not found");
        }

        Optional<Bid> highestamount =
                br.findTopByAuctionIdOrderByAmountDesc(auctionId);

        if (highestamount.isPresent()) {

            if (highestamount.get().getAmount() >= amount) {
                throw new BidException("Bid amount must be greater than the current highest bid");
            }

        } else {

            if (amount < a.get().getStartingPrice()) {
                throw new BidException("Bid amount must be at least the starting price");
            }
        }

        if(a.get().getStatus()!= AuctionStatus.ACTIVE){
            throw new BidException("Auction not Active Yet");
        }

        Bid bid = new Bid();

        bid.setAmount(amount);
        bid.setBuyer(u.get());
        bid.setAuction(a.get());
        bid.setBidTime(LocalDateTime.now());

        return br.save(bid);
    }

    public List<Bid> getBidsByAuction(Long auctionId) {
        return br.findByAuctionId(auctionId);
    }

    public List<Bid> getBidsByBuyer(long buyerId){
        return br.findByBuyerId(buyerId);
    }
}
