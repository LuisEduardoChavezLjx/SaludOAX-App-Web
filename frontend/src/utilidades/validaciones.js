const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_PASSWORD_SEGURA = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

export function validarFormularioAcceso({ email, contrasena }) {
  const errores = {};

  if (!email || !email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (!REGEX_EMAIL.test(email.trim())) {
    errores.email = 'Correo invalido. Ejemplo: nombre@correo.com';
  }

  if (!contrasena || !contrasena.trim()) {
    errores.contrasena = 'La contrasena es obligatoria.';
  } else if (!REGEX_PASSWORD_SEGURA.test(contrasena)) {
    errores.contrasena =
      'Debe tener minimo 8 caracteres, una mayuscula, un numero y un caracter especial.';
  }

  return errores;
}

export function tieneErrores(errores) {
  return Object.keys(errores).length > 0;
}