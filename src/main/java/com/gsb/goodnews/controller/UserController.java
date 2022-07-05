package com.gsb.goodnews.controller;

import com.gsb.goodnews.domain.User;
import com.gsb.goodnews.dto.UserDto;
import com.gsb.goodnews.exception.NotFoundException;
import com.gsb.goodnews.repository.UserRepository;
import com.gsb.goodnews.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<User> getById(@PathVariable long id) {
        final User user = this.userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<User>> getAll() {
        final List<User> users = this.userRepository.findAll();

        if (users.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<User> create(@RequestBody UserDto userDto) {
        final User user = this.userService.create(userDto);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
}
