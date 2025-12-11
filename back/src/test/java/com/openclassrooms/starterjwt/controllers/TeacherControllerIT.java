package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Teacher;
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

import java.util.Arrays;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class TeacherControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TeacherService teacherService;

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher/{id} should return 200 OK and Teacher DTO")
    public void shouldReturnTeacherById() throws Exception {
        // Arrange
        Teacher teacher = Teacher.builder()
                .id(1L)
                .lastName("Un")
                .firstName("Prof")
                .build();
        when(teacherService.findById(1L)).thenReturn(teacher);

        // Act & Assert
        mockMvc.perform(get("/api/teacher/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastName").value("Un"))
                .andExpect(jsonPath("$.firstName").value("Prof"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher/{id} should return 404 Not Found when teacher does not exist")
    public void shouldReturnNotFound() throws Exception {
        // Arrange
        // On simule l'exception levée par le service
        when(teacherService.findById(99L)).thenThrow(new NotFoundException());

        // Act & Assert
        mockMvc.perform(get("/api/teacher/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher/{id} with invalid ID format should return 400 Bad Request")
    public void shouldReturnBadRequest() throws Exception {
        // Act & Assert
        // Le controller attend un id numérique
        mockMvc.perform(get("/api/teacher/test")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/teacher should return 200 OK and list of Teachers")
    public void shouldReturnAllTeachers() throws Exception {
        // Arrange
        Teacher teacher1 = Teacher.builder().id(1L).lastName("Un").firstName("Prof").build();
        Teacher teacher2 = Teacher.builder().id(2L).lastName("Deux").firstName("Prof").build();
        when(teacherService.findAll()).thenReturn(Arrays.asList(teacher1, teacher2));

        // Act & Assert
        mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].lastName").value("Un"))
                .andExpect(jsonPath("$[1].lastName").value("Deux"));
    }
}