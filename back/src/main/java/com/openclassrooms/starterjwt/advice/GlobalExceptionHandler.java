package com.openclassrooms.starterjwt.advice;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.ForbiddenException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Void> handleNotFoundException(NotFoundException ex) {
        return ResponseEntity.notFound().build();
    }

    /**
     * Gère toutes les erreurs qui doivent retourner un 400 Bad Request :
     * BadRequestException : lancée manuellement (ex : participate déjà fait)
     * MethodArgumentNotValidException : échec de validation @Valid (ex : @NotBlank)
     * MethodArgumentTypeMismatchException : mauvais type dans l'URL (ex : String au lieu de Long)
     */
    @ExceptionHandler({
            BadRequestException.class,
            MethodArgumentNotValidException.class,
            MethodArgumentTypeMismatchException.class
    })
    public ResponseEntity<Void> handleBadRequestExceptions(Exception ex) {
        return ResponseEntity.badRequest().build();
    }

    /**
     * Gère les erreurs de permission
     * Renvoie 403 forbidden
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Void> handleForbiddenException(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

}
