package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Auction;
import com.propertymart.propertymart.entity.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuctionRepo extends JpaRepository<Auction,Long> {
    List<Auction> findByPropertySellerUserId(Long userId);
    List<Auction> findByWinnerIdAndStatus(
            Long winnerId,
            AuctionStatus status
    );
}
