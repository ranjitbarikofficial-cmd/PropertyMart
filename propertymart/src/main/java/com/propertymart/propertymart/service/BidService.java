
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

        if (buyerId == null) {
            throw new BidException("Please log in as a buyer to place a bid");
        }

        if (amount == null || amount <= 0) {
            throw new BidException("Bid amount must be greater than zero");
        }

        Optional<User> u = uur.findById(buyerId);

        if (u.isEmpty()) {
            throw new BidException("Buyer not found");
        }

        Optional<Auction> a = ar.findById(auctionId);

        if (a.isEmpty()) {
            throw new BidException("Auction not found");
        }

        Auction auction = a.get();

        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new BidException("Auction not Active Yet");
        }

        if (auction.getStartTime() == null || auction.getEndTime() == null
                || !auction.getStartTime().isBefore(auction.getEndTime())) {
            throw new BidException("Auction end time must be after start time");
        }

        Optional<Bid> highestAmount =
                br.findTopByAuctionIdOrderByAmountDesc(auctionId);

        if (highestAmount.isPresent()) {
            if (highestAmount.get().getAmount() >= amount) {
                throw new BidException("Bid amount must be greater than the current highest bid");
            }
        } else {
            if (amount < auction.getStartingPrice()) {
                throw new BidException("Bid amount must be at least the starting price");
            }
        }

        Bid bid = new Bid();
        bid.setAmount(amount);
        bid.setBuyer(u.get());
        bid.setAuction(auction);
        bid.setBidTime(LocalDateTime.now());

        return br.save(bid);
    }

    public Double getHighestBidAmount(Long auctionId) {
        Optional<Bid> highestBid =
                br.findTopByAuctionIdOrderByAmountDesc(auctionId);

        if (highestBid.isPresent()) {
            return highestBid.get().getAmount();
        }

        Optional<Auction> auction = ar.findById(auctionId);
        return auction.map(Auction::getStartingPrice).orElse(0.0);
    }

    public List<Bid> getBidsByAuction(Long auctionId) {
        return br.findByAuctionId(auctionId);
    }

    public List<Bid> getBidsByBuyer(long buyerId) {
        return br.findByBuyerId(buyerId);
    }

    public Optional<Bid> getHighestBid(Long auctionId) {
        return br.findTopByAuctionIdOrderByAmountDesc(auctionId);
    }
}
