package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepo extends JpaRepository<Bid,Long> {
   List<Bid> findByAuctionId(Long auctionId);
   List<Bid> findByBuyerId(Long buyerId);
   Optional<Bid> findTopByAuctionIdOrderByAmountDesc(Long auctionId);
}
