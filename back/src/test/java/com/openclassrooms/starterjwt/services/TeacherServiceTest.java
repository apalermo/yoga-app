package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;

    @BeforeEach
    public void setup() {
        teacher = Teacher.builder()
                .id(1L)
                .lastName("Un")
                .firstName("Prof")
                .build();
    }

    @Test
    @DisplayName("Test findAll teachers")
    public void shouldReturnAllTeachers() {
        // Arrange
        when(teacherRepository.findAll()).thenReturn(Collections.singletonList(teacher));

        // Act
        List<Teacher> teachers = teacherService.findAll();

        // Assert
        assertThat(teachers).hasSize(1);
        assertThat(teachers.getFirst().getLastName()).isEqualTo("Un");
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Test findById with existing ID")
    public void shouldReturnTeacherById() {
        // Arrange
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        // Act
        Teacher result = teacherService.findById(1L);

        // Assert
        assertThat(result).isEqualTo(teacher);
        verify(teacherRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Test findById with unknown ID throws NotFoundException")
    public void shouldThrowNotFoundException() {
        // Arrange
        when(teacherRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> teacherService.findById(99L))
                .isInstanceOf(NotFoundException.class);

        verify(teacherRepository, times(1)).findById(99L);
    }
}