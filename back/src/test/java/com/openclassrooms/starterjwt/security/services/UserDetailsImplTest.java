package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class UserDetailsImplTest {
    @Test
    void testEqualsAndHashCode() {
        UserDetailsImpl user1 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user2 = UserDetailsImpl.builder().id(1L).build();
        UserDetailsImpl user3 = UserDetailsImpl.builder().id(2L).build();

        assertThat(user1).isEqualTo(user2);
        assertThat(user1).isNotEqualTo(user3);
        assertThat(user1.hashCode()).isEqualTo(user2.hashCode());
        assertThat(user1.equals(null)).isFalse();
        assertThat(user1.equals(new Object())).isFalse();
    }

    @Test
    void testAuthoritiesAndAccountStatus() {
        // Arrange
        UserDetailsImpl user = UserDetailsImpl.builder().build();

        // Act & Assert
        // On appelle ces méthodes pour satisfaire JaCoCo (et vérifier qu'elles renvoient bien ce qu'on attend)
        assertThat(user.getAuthorities()).isEmpty(); // Vérifie le HashSet vide
        assertThat(user.isAccountNonExpired()).isTrue();
        assertThat(user.isAccountNonLocked()).isTrue();
        assertThat(user.isCredentialsNonExpired()).isTrue();
        assertThat(user.isEnabled()).isTrue();
    }
}