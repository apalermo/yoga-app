package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.SessionService;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.Date;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SessionService sessionService;

    @MockitoBean
    private TeacherService teacherService; // Indispensable pour le Mapper

    @Autowired
    private SessionMapper sessionMapper;

    private static final String API_PATH = "/api/session";

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/{id} should return session when exists")
    void shouldReturnSessionById() throws Exception {
        Session session = Session.builder()
                .id(1L)
                .name("Yoga Test")
                .description("Description")
                .date(new Date())
                .users(new ArrayList<>())
                .build();

        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(get(API_PATH + "/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Test"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/{id} should return 404 when session not found")
    void shouldReturnNotFoundWhenSessionDoesNotExist() throws Exception {
        when(sessionService.getById(99L)).thenThrow(new NotFoundException());

        mockMvc.perform(get(API_PATH + "/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/session/invalid should return 400 Bad Request")
    void shouldReturnBadRequestForInvalidId() throws Exception {
        mockMvc.perform(get(API_PATH + "/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST /api/session should create session")
    void shouldCreateSession() throws Exception {
        SessionDto dto = new SessionDto();
        dto.setName("New Session");
        dto.setDate(new Date());
        dto.setDescription("Description");
        dto.setTeacher_id(1L);

        // Mock du teacher pour le mapper
        Teacher teacher = Teacher.builder().id(1L).build();
        when(teacherService.findById(1L)).thenReturn(teacher);

        Session createdSession = Session.builder().id(1L).name("New Session").build();
        when(sessionService.create(any(Session.class))).thenReturn(createdSession);

        mockMvc.perform(post(API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Session"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST /api/session should return 400 when DTO is invalid")
    void shouldReturnBadRequestWhenCreatingInvalidSession() throws Exception {
        SessionDto emptyDto = new SessionDto(); // DTO vide invalide

        mockMvc.perform(post(API_PATH)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("PUT /api/session/{id} should update session")
    void shouldUpdateSession() throws Exception {
        SessionDto dto = new SessionDto();
        dto.setName("Updated Session");
        dto.setDate(new Date());
        dto.setDescription("Updated Desc");
        dto.setTeacher_id(1L);

        Teacher teacher = Teacher.builder().id(1L).build();
        when(teacherService.findById(1L)).thenReturn(teacher);

        Session updatedSession = Session.builder().id(1L).name("Updated Session").build();
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(updatedSession);

        mockMvc.perform(put(API_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("PUT /api/session/{id} should return 400 when DTO invalid")
    void shouldReturnBadRequestWhenUpdatingInvalidSession() throws Exception {
        SessionDto emptyDto = new SessionDto();

        mockMvc.perform(put(API_PATH + "/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/session/{id} should delete session")
    void shouldDeleteSession() throws Exception {
        mockMvc.perform(delete(API_PATH + "/1"))
                .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/session/{id} should return 404 when not found")
    void shouldReturnNotFoundWhenDeleteUnknownSession() throws Exception {
        doThrow(new NotFoundException()).when(sessionService).delete(99L);

        mockMvc.perform(delete(API_PATH + "/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST participate should succeed")
    void shouldParticipate() throws Exception {
        mockMvc.perform(post(API_PATH + "/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).participate(1L, 2L);
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("POST participate should return 400 on bad request")
    void shouldReturnBadRequestWhenParticipateFails() throws Exception {
        doThrow(new BadRequestException()).when(sessionService).participate(1L, 2L);

        mockMvc.perform(post(API_PATH + "/1/participate/2"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE participate should succeed")
    void shouldNoLongerParticipate() throws Exception {
        mockMvc.perform(delete(API_PATH + "/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 2L);
    }
}