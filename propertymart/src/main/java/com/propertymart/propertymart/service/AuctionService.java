
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.Exception.SellerNotFoundException;
import com.propertymart.propertymart.entity.*;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.PropertyRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {

    private final AuctionRepo ar;
    private final PropertyRepo pr;
    private final BidRepo br;
    private final UserRepo ur;

    public AuctionService(
            AuctionRepo auctionRepo,
            PropertyRepo propertyRepo,
            BidRepo bidRepo,
            UserRepo userRepo
    ) {
        ar = auctionRepo;
        pr = propertyRepo;
        br = bidRepo;
        ur = userRepo;
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

    public Auction updateAuction(Long id, Auction updatedAuction) {

        Auction existingAuction = ar.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Auction not found."));

        existingAuction.setStartTime(updatedAuction.getStartTime());
        existingAuction.setEndTime(updatedAuction.getEndTime());
        existingAuction.setStartingPrice(updatedAuction.getStartingPrice());
        existingAuction.setStatus(updatedAuction.getStatus());

        if (updatedAuction.getProperty() != null &&
                updatedAuction.getProperty().getId() != null) {

            Property property = pr.findById(updatedAuction.getProperty().getId())
                    .orElseThrow(() ->
                            new IllegalArgumentException("Property not found."));

            existingAuction.setProperty(property);
        }

        return ar.save(existingAuction);
    }

    public void deleteAuction(Long id) {
        ar.deleteById(id);
    }

    public List<Auction> getauctionbyuserid(Long id) {

        User user = ur.findById(id)
                .orElseThrow(() -> new SellerNotFoundException(
                        id + " is not a seller."
                ));

        if (user.getRole() != Role.SELLER) {
            throw new SellerNotFoundException(id + " is not a seller.");
        }

        return ar.findByPropertySellerUserId(id);
    }

    public List<Auction> findAuctionsBySellerUserId(Long userId) {
        return getauctionbyuserid(userId);
    }

    public List<Auction> getWonAuctionsByBuyerId(Long buyerId) {
        return ar.findByWinnerIdAndStatus(buyerId, AuctionStatus.ENDED);
    }

    public List<Auction> findWonAuctionsByBuyerId(Long buyerId) {
        return getWonAuctionsByBuyerId(buyerId);
    }

    public Double getWinningBidAmount(Long auctionId) {
        return br.findTopByAuctionIdOrderByAmountDesc(auctionId)
                .map(Bid::getAmount)
                .orElse(null);
    }
}
