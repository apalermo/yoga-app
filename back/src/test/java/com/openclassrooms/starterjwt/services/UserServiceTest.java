package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    public void setup() {
        user = User.builder()
                .id(1L)
                .email("studio@yoga.com")
                .lastName("Admin")
                .firstName("Admin")
                .password("test!1234")
                .build();
    }

    @Test
    @DisplayName("Test findById with existing ID")
    public void shouldReturnUserById() {
        // Arrange
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Act
        User result = userService.findById(1L);

        // Assert
        assertThat(result).isEqualTo(user);
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Test findById with unknown ID throws NotFoundException")
    public void shouldThrowNotFoundException() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> userService.findById(99L))
                .isInstanceOf(NotFoundException.class);

        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("Delete should verify user existence and delete it")
    void shouldDeleteUser() {

        when(userRepository.existsById(1L)).thenReturn(true);

        userService.delete(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Save should return the saved user")
    void shouldSaveUser() {
        // Arrange
        when(userRepository.save(user)).thenReturn(user);

        // Act
        User savedUser = userService.save(user);

        // Assert
        assertThat(savedUser).isEqualTo(user);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("ExistsByEmail should return true if email exists")
    void shouldReturnTrueIfEmailExists() {
        // Arrange
        String email = "studio@yoga.com";
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // Act
        boolean exists = userService.existsByEmail(email);

        // Assert
        assertThat(exists).isTrue();
        verify(userRepository, times(1)).existsByEmail(email);
    }

    @Test
    @DisplayName("ExistsByEmail should return false if email does not exist")
    void shouldReturnFalseIfEmailDoesNotExist() {
        // Arrange
        String email = "unknown@test.com";
        when(userRepository.existsByEmail(email)).thenReturn(false);

        // Act
        boolean exists = userService.existsByEmail(email);

        // Assert
        assertThat(exists).isFalse();
        verify(userRepository, times(1)).existsByEmail(email);
    }
}