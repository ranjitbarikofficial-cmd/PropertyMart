package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepo extends JpaRepository<Bid,Long> {

}
