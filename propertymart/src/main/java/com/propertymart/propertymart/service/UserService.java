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
    @Transactional
    public User updateUser(Long id, User u) {

        Optional<User> existingUser = ur.findById(id);

        if (existingUser.isPresent()) {

            User user = existingUser.get();

            if (u.getName() != null) user.setName(u.getName());
            if (u.getEmail() != null) user.setEmail(u.getEmail());
            if (u.getPassword() != null && !u.getPassword().isBlank()) {
                user.setPassword(u.getPassword());
            }
            if (u.getPhone() != null) user.setPhone(u.getPhone());
            if (u.getRole() != null) user.setRole(u.getRole());

            User saved = ur.save(user);

            // Sync Seller profile if user is SELLER
            if (saved.getRole() == Role.SELLER) {
                sr.findByUserId(saved.getId()).ifPresent(seller -> {
                    seller.setName(saved.getName());
                    seller.setEmail(saved.getEmail());
                    seller.setPhone(saved.getPhone());
                    sr.save(seller);
                });
            }

            return saved;
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

    public boolean resetPassword(String email, String newPassword) {
        Optional<User> userOpt = ur.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(newPassword);
            ur.save(user);
            return true;
        }
        return false;
    }
}