package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.DTO.ForgotPasswordRequest;
import com.propertymart.propertymart.entity.ApprovalStatus;
import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200",
        allowCredentials = "true")
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

        Optional<User> existingUser = us.findUserByEmail(loginUser.getEmail());

        if (existingUser.isEmpty() || !existingUser.get().getPassword().equals(loginUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    java.util.Map.of("message", "Invalid email or password.")
            );
        }

        User loggedInUser = existingUser.get();

        if (loggedInUser.getVerificationStatus() == ApprovalStatus.REJECTED) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    java.util.Map.of("message", "Your account has been rejected or blocked by administrator.")
            );
        }

        session.setAttribute("id", loggedInUser.getId());

        return ResponseEntity.ok().body(
                java.util.Map.of(
                        "id", loggedInUser.getId(),
                        "name", loggedInUser.getName(),
                        "email", loggedInUser.getEmail(),
                        "role", loggedInUser.getRole()
                )
        );
    }


    @PutMapping("/approval/{id}")
    public ResponseEntity<User> updateUserApproval(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> request) {

        ApprovalStatus approvalStatus;

        try {
            approvalStatus = ApprovalStatus.valueOf(
                    request.get("approvalStatus")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        User updatedUser = us.updateUserApproval(id, approvalStatus);

        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        String result = us.resetPassword(
                request.getEmail(),
                request.getNewPassword()
        );

        if (result.equals("User not found with this email.")) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }

        return ResponseEntity.ok(result);
    }

}