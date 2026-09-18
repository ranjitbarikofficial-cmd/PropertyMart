package com.propertymart.propertymart.service;

import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.repository.UserRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo ur;

    public UserService(UserRepo userRepo) {
        ur = userRepo;
    }

    // Create
    public User adduser(User u) {
        return ur.save(u);
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
}