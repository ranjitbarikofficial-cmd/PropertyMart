
package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.ApprovalStatus;
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

    @Transactional
    public User adduser(User u) {

        u.setVerificationStatus(ApprovalStatus.APPROVED);

        User savedUser = ur.save(u);

        if (savedUser.getRole() == Role.SELLER) {

            Optional<Seller> existingSeller =
                    sr.findByUserId(savedUser.getId());

            if (existingSeller.isEmpty()) {

                Seller seller = new Seller();

                seller.setUser(savedUser);
                seller.setName(savedUser.getName());
                seller.setEmail(savedUser.getEmail());
                seller.setPhone(savedUser.getPhone());
                seller.setVerificationStatus(ApprovalStatus.PENDING);

                sr.save(seller);
            }
        }

        return savedUser;
    }

    public List<User> findAllUsers() {
        return ur.findAll();
    }

    public Optional<User> findUserById(Long id) {
        return ur.findById(id);
    }

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

    public void deleteUser(Long id) {
        ur.deleteById(id);
    }

    public Optional<User> findUserByEmail(String email) {
        return ur.findByEmail(email);
    }

    public Optional<User> login(String email, String password) {

        Optional<User> user = ur.findByEmail(email);

        if (user.isPresent()
                && user.get().getPassword().equals(password)
                && user.get().getVerificationStatus() != ApprovalStatus.REJECTED) {
            return user;
        }

        return Optional.empty();
    }

    public String resetPassword(String email, String newPassword) {

        Optional<User> optionalUser = ur.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return "User not found with this email.";
        }

        User user = optionalUser.get();
        user.setPassword(newPassword);

        ur.save(user);

        return "Password updated successfully.";
    }

    @Transactional
    public User updateUserApproval(Long id, ApprovalStatus approvalStatus) {

        Optional<User> existingUser = ur.findById(id);

        if (existingUser.isEmpty()) {
            return null;
        }

        if (approvalStatus == null) {
            throw new IllegalArgumentException(
                    "Approval status is required"
            );
        }

        User user = existingUser.get();
        user.setVerificationStatus(approvalStatus);

        User savedUser = ur.save(user);

        if (savedUser.getRole() == Role.SELLER) {
            sr.findByUserId(savedUser.getId()).ifPresent(seller -> {
                seller.setVerificationStatus(approvalStatus);
                sr.save(seller);
            });
        }

        return savedUser;
    }
}
