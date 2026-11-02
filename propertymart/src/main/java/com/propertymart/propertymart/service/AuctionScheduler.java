
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import com.propertymart.propertymart.entity.Bid;
import com.propertymart.propertymart.repository.AuctionRepo;
import com.propertymart.propertymart.repository.BidRepo;
import com.propertymart.propertymart.repository.PropertyRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuctionScheduler {

    private final AuctionRepo auctionRepo;
    private final BidRepo bidRepo;
    private final PropertyRepo propertyRepo;

    public AuctionScheduler(
            AuctionRepo auctionRepo,
            BidRepo bidRepo,
            PropertyRepo propertyRepo
    ) {
        this.auctionRepo = auctionRepo;
        this.bidRepo = bidRepo;
        this.propertyRepo = propertyRepo;
    }

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void updateAuctionStatuses() {

        LocalDateTime now = LocalDateTime.now();
        List<Auction> auctions = auctionRepo.findAll();

        for (Auction auction : auctions) {

            if (auction.getStartTime() == null ||
                    auction.getEndTime() == null) {
                continue;
            }

            if (now.isBefore(auction.getStartTime())) {
                auction.setStatus(AuctionStatus.UPCOMING);
            } else if (now.isBefore(auction.getEndTime())) {
                auction.setStatus(AuctionStatus.ACTIVE);
            } else {

                if (auction.getStatus() != AuctionStatus.ENDED) {

                    auction.setStatus(AuctionStatus.ENDED);

                    Optional<Bid> highestBid =
                            bidRepo.findTopByAuctionIdOrderByAmountDesc(
                                    auction.getId()
                            );

                    if (highestBid.isPresent()) {

                        Bid winningBid = highestBid.get();

                        auction.setWinner(winningBid.getBuyer());
                        auction.setWinningBid(winningBid.getAmount());

                        if (auction.getProperty() != null) {
                            auction.getProperty().setStatus("SOLD");
                            propertyRepo.save(auction.getProperty());
                        }
                    }
                }
            }

            auctionRepo.save(auction);
        }
    }
}
