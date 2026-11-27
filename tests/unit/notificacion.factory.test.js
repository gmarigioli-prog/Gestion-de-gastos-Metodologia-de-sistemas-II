// Pruebas unitarias para la futura implementación de la fábrica de notificaciones.

import {describe, it, expect} from 'vitest';
import {crearNotificacion} from '../../src/factories/notificacion.factory.js';

describe('crearNotificacion', () => {
  it('Crea una notificación con los datos proporcionados', () => {
    const input = {
      tipo: 'email',
      destinatario: 'user@example.com',
      asunto: 'Notificacion de prueba',
      mensaje: 'Esto es una prueba.',
    };
    const notification = crearNotificacion(input);
    expect(notification).toEqual(input);
  });
});

