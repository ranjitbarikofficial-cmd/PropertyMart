package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.entity.Property;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.PropertyRepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {

    private final AuctionRepo ar;
    private final PropertyRepo pr;
    private final BidRepo br;

    public AuctionService(AuctionRepo auctionRepo, PropertyRepo propertyRepo, BidRepo bidRepo) {
        ar = auctionRepo;
        pr = propertyRepo;
        br = bidRepo;
    }


    public Auction addAuction(Auction auction) {

        if (auction.getProperty() != null) {

            Long propertyId = auction.getProperty().getId();

            Optional<Property> property = pr.findById(propertyId);

            if (property.isPresent()) {
                auction.setProperty(property.get());
            } else {
                return null;
            }
        }

        return ar.save(auction);
    }


    public List<Auction> findAllAuctions() {
        return ar.findAll();
    }


    public Optional<Auction> findAuctionById(Long id) {
        return ar.findById(id);
    }


    public Auction updateAuction(Long id, Auction auction) {

        Optional<Auction> existingAuction = ar.findById(id);

        if (existingAuction.isPresent()) {

            Auction a = existingAuction.get();

            a.setStartTime(auction.getStartTime());
            a.setEndTime(auction.getEndTime());
            a.setStartingPrice(auction.getStartingPrice());
            a.setStatus(auction.getStatus());

            if (auction.getProperty() != null) {

                Long propertyId = auction.getProperty().getId();

                Optional<Property> property = pr.findById(propertyId);

                if (property.isPresent()) {
                    a.setProperty(property.get());
                } else {
                    return null;
                }
            }

            return ar.save(a);
        }

        return null;
    }


    public void deleteAuction(Long id) {
        ar.deleteById(id);
    }

    public List<Auction> findAuctionsBySellerUserId(Long userId) {
        return ar.findByPropertySellerUserId(userId);
    }

    public List<Auction> findWonAuctionsByBuyerId(Long buyerId) {
        // First ensure any ENDED auctions without winnerBuyer recorded are populated
        List<Auction> endedAuctions = ar.findByStatus(AuctionStatus.ENDED);
        for (Auction auction : endedAuctions) {
            if (auction.getWinnerBuyer() == null) {
                Optional<Bid> highestBid = br.findTopByAuctionIdOrderByAmountDesc(auction.getId());
                if (highestBid.isPresent()) {
                    auction.setWinnerBuyer(highestBid.get().getBuyer());
                    auction.setWinningBid(highestBid.get().getAmount());
                    if (auction.getProperty() != null) {
                        auction.getProperty().setStatus("SOLD");
                        pr.save(auction.getProperty());
                    }
                    ar.save(auction);
                }
            }
        }
        return ar.findByWinnerBuyerId(buyerId);
    }
}

