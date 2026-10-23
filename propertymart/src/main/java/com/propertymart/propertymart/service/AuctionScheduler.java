
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
public class AuctionScheduler {

    private final AuctionRepo ar;
    private final BidRepo br;

    public AuctionScheduler(AuctionRepo ar, BidRepo br) {
        this.ar = ar;
        this.br = br;
    }

    @Scheduled(fixedRate = 5000)
    public void updateAuctionStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<Auction> auctions = ar.findAll();

        for (Auction auction : auctions) {
            if (now.isBefore(auction.getStartTime())) {
                auction.setStatus(AuctionStatus.UPCOMING);
            } else if (now.isBefore(auction.getEndTime())) {
                auction.setStatus(AuctionStatus.ACTIVE);
            } else {
                if (auction.getStatus() != AuctionStatus.ENDED) {
                    Optional<Bid> highestBid =
                            br.findTopByAuctionIdOrderByAmountDesc(auction.getId());

                    if (highestBid.isPresent()) {
                        auction.setWinner(highestBid.get().getBuyer());
                    } else {
                        auction.setWinner(null);
                    }
                }

                auction.setStatus(AuctionStatus.ENDED);
            }
        }

        ar.saveAll(auctions);
    }
}
