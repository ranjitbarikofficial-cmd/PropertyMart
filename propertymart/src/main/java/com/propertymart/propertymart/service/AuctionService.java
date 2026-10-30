package com.propertymart.propertymart.service;

import com.propertymart.propertymart.Exception.SellerNotFoundException;
import com.propertymart.propertymart.entity.*;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.PropertyRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {

    private final AuctionRepo ar;
    private final PropertyRepo pr;
    @Autowired
    private UserRepo ur;
    @Autowired
    private BidRepo br;

    public AuctionService(AuctionRepo auctionRepo, PropertyRepo propertyRepo) {
        ar = auctionRepo;
        pr = propertyRepo;
    }



    public Auction addAuction(Auction auction) {

        if (auction.getProperty() == null ||
                auction.getProperty().getId() == null) {
            throw new IllegalArgumentException("Please select a valid property.");
        }

        Long propertyId = auction.getProperty().getId();

        Property property = pr.findById(propertyId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Property not found."));

        if ("SOLD".equalsIgnoreCase(property.getStatus())) {
            throw new IllegalArgumentException(
                    "This property has already been sold and cannot be auctioned again."
            );
        }

        boolean existingAuction = ar.existsByPropertyIdAndStatusIn(
                propertyId,
                List.of(AuctionStatus.UPCOMING, AuctionStatus.ACTIVE)
        );

        if (existingAuction) {
            throw new IllegalArgumentException(
                    "This property already has an active or upcoming auction."
            );
        }

        auction.setProperty(property);

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

    public List<Auction> getauctionbyuserid(Long id){
        Optional<User> u=ur.findById(id);
        if(u.get().getRole()!= Role.SELLER){
           throw new SellerNotFoundException(id+" is not a seller.");
        }
        return ar.findByPropertySellerUserId(id);
    }

    public List<Auction> getWonAuctionsByBuyerId(Long buyerId) {
        return ar.findByWinnerIdAndStatus(buyerId, AuctionStatus.ENDED);
    }

    public Double getWinningBidAmount(Long auctionId) {
        return br.findTopByAuctionIdOrderByAmountDesc(auctionId)
                .map(Bid::getAmount)
                .orElse(null);
    }
}
