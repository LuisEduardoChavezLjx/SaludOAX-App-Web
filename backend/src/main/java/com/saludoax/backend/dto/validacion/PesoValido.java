package com.saludoax.backend.dto.validacion;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import jakarta.validation.ReportAsSingleViolation;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = {})
@Target({FIELD, PARAMETER})
@Retention(RUNTIME)
@ReportAsSingleViolation
@DecimalMin(value = "1.0")
@DecimalMax(value = "400.0")
public @interface PesoValido {

    String message() default "El peso debe estar entre 1 y 400 kg";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
