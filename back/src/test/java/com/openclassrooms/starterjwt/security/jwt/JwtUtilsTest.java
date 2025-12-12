package com.openclassrooms.starterjwt.security.jwt;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "5342afc37035d9ac445a98724e3fec31e85b01c15478135e74b64083adb532636209588a6cd232071e7c777b7033b50463245625a70ab6f469d986ab85bafd9f");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000); // 1 heure
    }

    @Test
    @DisplayName("GenerateJwtToken should generate a valid token")
    void shouldGenerateValidToken() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder().username("test@test.com").build();
        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertThat(token).isNotNull();
        assertThat(jwtUtils.validateJwtToken(token)).isTrue();
        assertThat(jwtUtils.getUserNameFromJwtToken(token)).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("ValidateJwtToken should return false for invalid token")
    void shouldReturnFalseWhenTokenIsInvalid() {
        assertThat(jwtUtils.validateJwtToken("invalid-token")).isFalse();
    }

    @Test
    @DisplayName("ValidateJwtToken should return false for empty token")
    void shouldReturnFalseWhenTokenIsEmpty() {
        assertThat(jwtUtils.validateJwtToken("")).isFalse();
    }
}