package com.openclassrooms.starterjwt.controllers;


import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/user/{id} should return 200 OK and User DTO")
    public void shouldReturnUserById() throws Exception {
        User user = User.builder()
                .id(1L)
                .email("yoga@studio.com")
                .lastName("Admin")
                .firstName("Admin")
                .password("test!1234")
                .admin(true)
                .build();

        when(userService.findById(1L)).thenReturn(user);

        mockMvc.perform(get("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("yoga@studio.com"))
                .andExpect(jsonPath("$.lastName").value("Admin"));
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/user/{id} should return 404 Not Found when user does not exist")
    public void shouldReturnNotFound() throws Exception {
        when(userService.findById(99L)).thenThrow(new NotFoundException());

        mockMvc.perform(get("/api/user/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("GET /api/user/invalid should return 400 Bad Request")
    public void shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/user/invalid")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "yoga@studio.com")
    @DisplayName("DELETE /api/user/{id} should return 200 OK when user deletes their own account")
    public void shouldDeleteOwnAccount() throws Exception {
        // L'utilisateur en base a l'email "yoga@studio.com"
        User user = User.builder()
                .id(1L)
                .email("yoga@studio.com")
                .lastName("Admin")
                .firstName("Admin")
                .password("test!1234")
                .admin(true)
                .build();

        when(userService.findById(1L)).thenReturn(user);

        // L'utilisateur connecté (WithMockUser) a aussi "yoga@studio.com" -> OK
        mockMvc.perform(delete("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "mechant@hacker.com")
    @DisplayName("DELETE /api/user/{id} should return 403 Forbidden when deleting someone else account")
    public void shouldNotDeleteOtherAccount() throws Exception {
        // L'utilisateur en base est "yoga@studio.com"
        User user = User.builder()
                .id(1L)
                .email("yoga@studio.com")
                .lastName("Admin")
                .firstName("Admin")
                .password("test!1234")
                .admin(true)
                .build();
        when(userService.findById(1L)).thenReturn(user);

        // L'utilisateur connecté est "mechant@hacker.com" -> Pas le même email -> Forbidden
        mockMvc.perform(delete("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }
}