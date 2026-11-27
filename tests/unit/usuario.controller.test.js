import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const fs = require('node:fs').promises;
const mocks = { readFile: null, writeFile: null };
const {
  getUsuarioAll,
  getUsuarioById,
  postNewUsuario,
  putUsuarioById,
  deleteUsuarioById
} = require('../../src/controllers/usuario.controller');

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

const usuarios = [
  { id: 1, nombre: 'Ana', apellido: 'Perez', email: 'ana@example.com', isActive: true },
  { id: 2, nombre: 'Luis', apellido: 'Gomez', email: 'luis@example.com', isActive: false }
];

describe('usuario.controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.readFile = vi.spyOn(fs, 'readFile');
    mocks.writeFile = vi.spyOn(fs, 'writeFile');
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getUsuarioAll', () => {
    it('returns all users', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      const res = createResponse();

      await getUsuarioAll({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(usuarios);
    });

    it('returns an empty array when the file contains no users', async () => {
      mocks.readFile.mockResolvedValue('[]');
      const res = createResponse();

      await getUsuarioAll({}, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 500 when users cannot be read', async () => {
      mocks.readFile.mockRejectedValue(new Error('read failure'));
      const res = createResponse();

      await getUsuarioAll({}, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('No se pudieron obtener los datos de los usuarios');
    });

    it('returns 500 when the stored JSON is invalid', async () => {
      mocks.readFile.mockResolvedValue('{invalid');
      const res = createResponse();

      await getUsuarioAll({}, res);

      expect(res.statusCode).toBe(500);
    });
  });

  describe('getUsuarioById', () => {
    it('returns the requested user', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      const res = createResponse();

      await getUsuarioById({ params: { id: '2' } }, res);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(usuarios[1]);
    });

    it('returns 404 for a missing or non-numeric id', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      const res = createResponse();

      await getUsuarioById({ params: { id: '99' } }, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.msg).toContain('99');
    });

    it('returns 500 when user details cannot be read', async () => {
      mocks.readFile.mockRejectedValue(new Error('read failure'));
      const res = createResponse();

      await getUsuarioById({ params: { id: '1' } }, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('No se pudo obtener el detalle del usuario');
    });
  });

  describe('postNewUsuario', () => {
    it('creates and persists a new user', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-27T12:00:00.000Z'));
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockResolvedValue();
      const res = createResponse();

      await postNewUsuario({
        body: { nombre: 'Marta', apellido: 'Lopez', email: 'marta@example.com' }
      }, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.usuario).toMatchObject({
        id: 3,
        nombre: 'Marta',
        apellido: 'Lopez',
        email: 'marta@example.com',
        isActive: true,
        fechaAlta: '2026-11-27',
        modificacion: '2026-11-27'
      });
      expect(mocks.writeFile).toHaveBeenCalledWith(
        './data/usuarios.json',
        expect.stringContaining('"id": 3'),
        'utf8'
      );
      vi.useRealTimers();
    });

    it('uses id 1 when the stored list is empty', async () => {
      mocks.readFile.mockResolvedValue('[]');
      mocks.writeFile.mockResolvedValue();
      const res = createResponse();

      await postNewUsuario({
        body: { nombre: 'Ana', apellido: 'Perez', email: 'ana@example.com' }
      }, res);

      expect(res.statusCode).toBe(201);
      expect(res.body.usuario.id).toBe(1);
    });

    it('returns 400 when required fields are missing', async () => {
      const res = createResponse();

      await postNewUsuario({ body: { nombre: '', apellido: '', email: '' } }, res);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(mocks.readFile).not.toHaveBeenCalled();
    });

    it('returns 500 when a new user cannot be persisted', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockRejectedValue(new Error('write failure'));
      const res = createResponse();

      await postNewUsuario({
        body: { nombre: 'Marta', apellido: 'Lopez', email: 'marta@example.com' }
      }, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('No se pudo crear el usuario');
    });
  });

  describe('putUsuarioById', () => {
    it('updates and persists the supplied fields', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-11-27T12:00:00.000Z'));
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockResolvedValue();
      const res = createResponse();

      await putUsuarioById({
        params: { id: '1' },
        body: { nombre: 'Ana Maria', isActive: false }
      }, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.usuario).toMatchObject({
        id: 1,
        nombre: 'Ana Maria',
        apellido: 'Perez',
        isActive: false,
        modificacion: '2026-11-27'
      });
      vi.useRealTimers();
    });

    it('does not update fields omitted from the request', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockResolvedValue();
      const res = createResponse();

      await putUsuarioById({
        params: { id: '1' },
        body: { email: 'nueva@example.com' }
      }, res);

      expect(res.body.usuario.nombre).toBe('Ana');
      expect(res.body.usuario.apellido).toBe('Perez');
      expect(res.body.usuario.email).toBe('nueva@example.com');
    });

    it('returns 404 when the user to update does not exist', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      const res = createResponse();

      await putUsuarioById({
        params: { id: '99' },
        body: { nombre: 'Inexistente' }
      }, res);

      expect(res.statusCode).toBe(404);
      expect(mocks.writeFile).not.toHaveBeenCalled();
    });

    it('returns 400 when no valid update fields are supplied', async () => {
      const res = createResponse();

      await putUsuarioById({
        params: { id: '1' },
        body: {}
      }, res);

      expect(res.statusCode).toBe(400);
      expect(mocks.readFile).not.toHaveBeenCalled();
    });
  });

  describe('deleteUsuarioById', () => {
    it('removes and persists the requested user', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockResolvedValue();
      const res = createResponse();

      await deleteUsuarioById({ params: { id: '1' } }, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.usuario).toEqual(usuarios[0]);
      expect(mocks.writeFile).toHaveBeenCalledWith(
        './data/usuarios.json',
        expect.not.stringContaining('"id": 1'),
        'utf8'
      );
    });

    it('returns 404 when the user to delete does not exist', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      const res = createResponse();

      await deleteUsuarioById({ params: { id: '99' } }, res);

      expect(res.statusCode).toBe(404);
      expect(mocks.writeFile).not.toHaveBeenCalled();
    });

    it('returns 500 when a deletion cannot be persisted', async () => {
      mocks.readFile.mockResolvedValue(JSON.stringify(usuarios));
      mocks.writeFile.mockRejectedValue(new Error('write failure'));
      const res = createResponse();

      await deleteUsuarioById({ params: { id: '1' } }, res);

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('No se pudo eliminar el usuario');
    });
  });
});
