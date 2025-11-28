package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.exception.ForbiddenException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserMapper userMapper;
    private final UserService userService;


    public UserController(UserService userService,
                          UserMapper userMapper) {
        this.userMapper = userMapper;
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable("id") String id) {

        User user = this.userService.findById(Long.valueOf(id));
        return ResponseEntity.ok().body(this.userMapper.toDto(user));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id) {

        User user = this.userService.findById(Long.valueOf(id));
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!Objects.equals(userDetails.getUsername(), user.getEmail())) {
            throw new ForbiddenException();
        }

        this.userService.delete(Long.parseLong(id));
        return ResponseEntity.ok().build();

    }
}
