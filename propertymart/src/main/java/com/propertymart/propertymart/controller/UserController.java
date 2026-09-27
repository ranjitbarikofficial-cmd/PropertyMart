package com.propertymart.propertymart.controller;

import com.propertymart.propertymart.entity.User;
import com.propertymart.propertymart.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
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

    // Create
    @PostMapping("/create")
    public ResponseEntity<User> addUser(@RequestBody User u) {
        User uu = us.adduser(u);
        return ResponseEntity.ok().body(uu);
    }

    // Find all
    @GetMapping("/alluser")
    public ResponseEntity<List<User>> findAllUsers() {
        List<User> users = us.findAllUsers();
        return ResponseEntity.ok().body(users);
    }

    // Find by ID
    @GetMapping("/find/{id}")
    public ResponseEntity<User> findUserById(@PathVariable Long id) {

        Optional<User> user = us.findUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok().body(user.get());
        }

        return ResponseEntity.notFound().build();
    }

    // Update
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

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {

        us.deleteUser(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<User> verify(@RequestBody User user, HttpSession s){
        User vu=us.login(user.getEmail(),user.getPassword());
        if(vu!=null){
            s.setAttribute("id",vu.getId());
            return ResponseEntity.status(HttpStatus.OK).body(vu);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}