package com.openclassrooms.starterjwt.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.AuthenticationException;

import java.io.IOException;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthEntryPointJwtTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @Test
    void commenceShouldTriggerUnauthorized() throws IOException, ServletException {
        // Arrange
        AuthEntryPointJwt entryPoint = new AuthEntryPointJwt();

        // On crée un mock pour le flux de sortie (OutputStream)
        ServletOutputStream outputStream = mock(ServletOutputStream.class);

        //  On dit à la réponse de renvoyer ce mock quand on l'appelle
        // (Sinon ça renvoie null et ça plante Jackson/ObjectMapper)
        when(response.getOutputStream()).thenReturn(outputStream);

        // Act
        entryPoint.commence(request, response, authException);

        // Assert
        // On vérifie que le status 401 est bien défini
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // On vérifie que le type de contenu est bien JSON
        verify(response).setContentType(org.springframework.http.MediaType.APPLICATION_JSON_VALUE);
    }
}