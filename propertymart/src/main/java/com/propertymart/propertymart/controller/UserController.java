package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
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
            session.setAttribute("id",loggedInUser.getId());

            return ResponseEntity.ok().body(
                    java.util.Map.of(
                            "id", loggedInUser.getId(),
                            "name", loggedInUser.getName(),
                            "email", loggedInUser.getEmail(),
                            "role", loggedInUser.getRole()
                    )
            );
        }

        return ResponseEntity.status(401).body(
                java.util.Map.of(
                        "message", "Invalid email or password"
                )
        );
    }
}