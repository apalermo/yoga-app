package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public void delete(Long id) {
        if (!this.userRepository.existsById(id)) {
            throw new NotFoundException();
        }
        this.userRepository.deleteById(id);
    }

    public User findById(Long id) {
        return this.userRepository.findById(id).orElseThrow(NotFoundException::new);
    }

    public boolean existsByEmail(String userEmail) {
        return this.userRepository.existsByEmail(userEmail);
    }
}
