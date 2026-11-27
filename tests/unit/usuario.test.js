// Pruebas unitarias para el modelo de usuario a usar a futuro.

import {describe, it, expect, beforeAll, afterAll} from 'vitest';
import { Usuario } from '../../src/models/usuario.model.js';

describe('Usuario', () => {
  it('creates a user with the supplied fields', () => {
    const data = {
      id: 1,
      nombre: 'Ana',
      correo: 'ana@example.com',
      contrasena: 'example-password',
    };

    const usuario = new Usuario(data);

    expect(usuario).toBeInstanceOf(Usuario);
    expect(usuario).toMatchObject(data);
  });
});