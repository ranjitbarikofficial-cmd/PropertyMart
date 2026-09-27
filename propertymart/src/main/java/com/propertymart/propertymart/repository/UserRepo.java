package com.propertymart.propertymart.repository;

import com.propertymart.propertymart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {

    Optional<User> findByEmailAndPassword(String email,String password);
}
