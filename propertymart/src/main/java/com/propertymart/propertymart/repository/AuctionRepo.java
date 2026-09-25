package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Auction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuctionRepo extends JpaRepository<Auction,Long> {
}
