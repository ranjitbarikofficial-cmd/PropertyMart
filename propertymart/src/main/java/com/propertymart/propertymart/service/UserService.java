package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.Role;
import com.propertymart.propertymart.entity.Seller;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.SellerRepo;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo ur;
    private final SellerRepo sr;

    public UserService(UserRepo userRepo, SellerRepo sellerRepo) {
        ur = userRepo;
        sr = sellerRepo;
    }

    // Create User
    @Transactional
    public User adduser(User u) {

        // Save User first
        User savedUser = ur.save(u);

        // If registered as SELLER,
        // automatically create Seller profile
        if (savedUser.getRole() == Role.SELLER) {

            Optional<Seller> existingSeller =
                    sr.findByUserId(savedUser.getId());

            if (existingSeller.isEmpty()) {

                Seller seller = new Seller();

                seller.setUser(savedUser);
                seller.setName(savedUser.getName());
                seller.setEmail(savedUser.getEmail());
                seller.setPhone(savedUser.getPhone());

                sr.save(seller);
            }
        }

        return savedUser;
    }

    // Find all users
    public List<User> findAllUsers() {
        return ur.findAll();
    }

    // Find user by ID
    public Optional<User> findUserById(Long id) {
        return ur.findById(id);
    }

    // Update user
    public User updateUser(Long id, User u) {

        Optional<User> existingUser = ur.findById(id);

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            user.setName(u.getName());
            user.setEmail(u.getEmail());
            user.setPassword(u.getPassword());
            user.setPhone(u.getPhone());
            user.setRole(u.getRole());

            return ur.save(user);
        }

        return null;
    }

    // Delete user
    public void deleteUser(Long id) {
        ur.deleteById(id);
    }

    // Login
    public Optional<User> login(String email, String password) {

        Optional<User> user = ur.findByEmail(email);

        if (user.isPresent()
                && user.get().getPassword().equals(password)) {

            return user;
        }

        return Optional.empty();
    }
}