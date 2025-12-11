package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    // --- CRUD TESTS ---

    @Test
    @DisplayName("Create should save and return the session")
    void shouldCreateSession() {
        // Arrange
        Session session = new Session();
        session.setName("Yoga Matin");
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // Act
        Session created = sessionService.create(new Session());

        // Assert
        assertThat(created.getName()).isEqualTo("Yoga Matin");
        verify(sessionRepository, times(1)).save(any(Session.class));
    }

    @Test
    @DisplayName("GetById should return session if found")
    void shouldGetSessionById() {
        Session session = Session.builder().id(1L).name("Test").build();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        Session found = sessionService.getById(1L);

        assertThat(found).isEqualTo(session);
    }

    @Test
    @DisplayName("GetById should throw NotFoundException if not found")
    void shouldThrowNotFoundWhenSessionDoesNotExist() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.getById(1L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("FindAll should return list of sessions")
    void shouldFindAllSessions() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertThat(result).hasSize(2);
    }

    @Test
    @DisplayName("Update should update and return session")
    void shouldUpdateSession() {
        // Arrange
        Session session = Session.builder().id(1L).name("Updated").build();
        when(sessionRepository.existsById(1L)).thenReturn(true); // Important pour passer le check !
        when(sessionRepository.save(any(Session.class))).thenReturn(session);

        // Act
        Session updated = sessionService.update(1L, session);

        // Assert
        assertThat(updated.getName()).isEqualTo("Updated");
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("Update should throw NotFoundException if session ID unknown")
    void shouldThrowNotFoundWhenUpdateUnknownSession() {
        when(sessionRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> sessionService.update(1L, new Session()))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("Delete should verify existence and delete")
    void shouldDeleteSession() {
        when(sessionRepository.existsById(1L)).thenReturn(true);

        sessionService.delete(1L);

        verify(sessionRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Delete should throw NotFoundException if session ID unknown")
    void shouldThrowNotFoundWhenDeleteUnknownSession() {
        when(sessionRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> sessionService.delete(1L))
                .isInstanceOf(NotFoundException.class);
    }

    // --- PARTICIPATION LOGIC ---

    @Test
    @DisplayName("Participate should add user to session")
    void shouldParticipate() {
        // Arrange
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>()); // Liste vide

        User user = new User();
        user.setId(2L);

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        // Act
        sessionService.participate(1L, 2L);

        // Assert
        assertThat(session.getUsers()).contains(user);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("Participate should throw BadRequest if user already participating")
    void shouldThrowBadRequestIfAlreadyParticipating() {
        User user = new User();
        user.setId(2L);

        Session session = new Session();
        session.setId(1L);
        session.setUsers(List.of(user)); // User déjà présent

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> sessionService.participate(1L, 2L))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("Participate should throw NotFound if session or user not found")
    void shouldThrowNotFoundWhenParticipateResourceMissing() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> sessionService.participate(1L, 2L))
                .isInstanceOf(NotFoundException.class);
    }

    @Test
    @DisplayName("NoLongerParticipate should remove user from session")
    void shouldNoLongerParticipate() {
        User user = new User();
        user.setId(2L);

        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>(List.of(user))); // Liste mutable avec l'user

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, 2L);

        assertThat(session.getUsers()).doesNotContain(user);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    @DisplayName("NoLongerParticipate should throw BadRequest if user not in session")
    void shouldThrowBadRequestIfNotParticipating() {
        Session session = new Session();
        session.setId(1L);
        session.setUsers(new ArrayList<>()); // Liste vide

        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertThatThrownBy(() -> sessionService.noLongerParticipate(1L, 2L))
                .isInstanceOf(BadRequestException.class);
    }
}