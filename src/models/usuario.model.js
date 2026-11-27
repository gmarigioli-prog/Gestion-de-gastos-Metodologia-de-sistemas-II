export class Usuario {
  constructor({ id, nombre, correo, contrasena }) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this.contrasena = contrasena;
  }
}

function crearUsuario({ id, nombre, correo, contrasena }) {
  if (typeof id !== 'number' || id <= 0) {
    throw new TypeError('El id del usuario es obligatorio y debe ser un número positivo');
  }
  if (typeof nombre !== 'string' || nombre.trim() === '') {
    throw new TypeError('El nombre del usuario es obligatorio');
  }
  if (typeof correo !== 'string' || correo.trim() === '') {
    throw new TypeError('El correo del usuario es obligatorio');
  }
  if (typeof contrasena !== 'string' || contrasena.trim() === '') {
    throw new TypeError('La contraseña del usuario es obligatoria');
  }
  return new Usuario({ id, nombre, correo, contrasena });
}