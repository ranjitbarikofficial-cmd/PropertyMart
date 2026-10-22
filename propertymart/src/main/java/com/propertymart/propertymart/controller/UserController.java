package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService us;

    public UserController(UserService userService) {
        us = userService;
    }

    @PostMapping("/create")
    public ResponseEntity<User> addUser(@RequestBody User u) {
        User uu = us.adduser(u);
        return ResponseEntity.ok().body(uu);
    }

    @GetMapping("/alluser")
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = us.findAllUsers();
        return ResponseEntity.ok().body(users);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<User> findUserById(@PathVariable Long id) {

        Optional<User> user = us.findUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok().body(user.get());
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody User u) {

        User updatedUser = us.updateUser(id, u);

        if (updatedUser != null) {
            return ResponseEntity.ok().body(updatedUser);
        }

        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        us.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User loginUser,
            HttpSession session) {

        Optional<User> user = us.login(
                loginUser.getEmail(),
                loginUser.getPassword()
        );

        if (user.isPresent()) {

            User loggedInUser = user.get();
            session.setAttribute("id", loggedInUser.getId());

            return ResponseEntity.ok().body(
                    java.util.Map.of(
                            "id", loggedInUser.getId(),
                            "name", loggedInUser.getName() != null ? loggedInUser.getName() : "",
                            "email", loggedInUser.getEmail() != null ? loggedInUser.getEmail() : "",
                            "phone", loggedInUser.getPhone() != null ? loggedInUser.getPhone() : "",
                            "role", loggedInUser.getRole() != null ? loggedInUser.getRole() : ""
                    )
            );
        }

        return ResponseEntity.status(401).body(
                java.util.Map.of(
                        "message", "Invalid email or password"
                )
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.get("email");
        String newPassword = payload.get("newPassword");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Email is required"));
        }

        boolean updated = us.resetPassword(email, newPassword != null && !newPassword.isBlank() ? newPassword : "password123");
        if (updated) {
            return ResponseEntity.ok(java.util.Map.of("message", "Password reset instructions / new password applied successfully"));
        }
        return ResponseEntity.status(404).body(java.util.Map.of("message", "No user found with this email"));
    }
}