// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextEncoder } from 'node:util';
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const USERS_KEY = 'finanzapp-usuarios';
const SESSION_KEY = 'finanzapp-sesion';
const page = readFileSync(resolve(process.cwd(), 'public/index.html'), 'utf8');

async function cargarApp() {
  vi.resetModules();
  document.open();
  document.write(page);
  document.close();
  await import('../../public/app.js');
}

async function formaAutenticacion(username, password, register = false) {
  if (register) document.querySelector('#auth-switch').click();

  document.querySelector('#auth-username').value = username;
  document.querySelector('#auth-password').value = password;
  document.querySelector('#auth-form').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );
}

async function hashContrasena(username, password) {
  const data = new TextEncoder().encode(`${username}:${password}`);
  const buffer = await webcrypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

beforeEach(async () => {
  localStorage.clear();
  vi.stubGlobal('crypto', webcrypto);
  vi.stubGlobal('TextEncoder', TextEncoder);
  await cargarApp();
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

describe('Autenticación de usuarios', () => {
  it('registra un nombre de usuario y comienza una sesión', async () => {
    await formaAutenticacion(' Marta ', 'example-password', true);

    await vi.waitFor(() => {
      expect(localStorage.getItem(SESSION_KEY)).toBe('marta');
    });

    const users = JSON.parse(localStorage.getItem(USERS_KEY));
    expect(users.marta.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(users.marta.hash).not.toBe('example-password');
    expect(document.querySelector('#auth-screen').hidden).toBe(true);
    expect(document.querySelector('#app').hidden).toBe(false);
    expect(document.querySelector('#user-label').textContent).toBe('Hola, marta');
  });

  it('rechaza nombres de usuario duplicados sin reemplazar la cuenta existente', async () => {
    const existingUsers = { marta: { hash: 'existing-hash' } };
    localStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

    await formaAutenticacion('Marta', 'another-password', true);

    await vi.waitFor(() => {
      expect(document.querySelector('#auth-error').hidden).toBe(false);
    });

    expect(document.querySelector('#auth-error').textContent).toBe('Ese usuario ya existe.');
    expect(JSON.parse(localStorage.getItem(USERS_KEY))).toEqual(existingUsers);
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
  });

  it('acepta credenciales válidas y rechaza una contraseña incorrecta', async () => {
    const username = 'ana';
    const password = 'contrasena-correcta';
    localStorage.setItem(
      USERS_KEY,
      JSON.stringify({ [username]: { hash: await hashContrasena(username, password) } })
    );

    await formaAutenticacion(username, 'contrasena-incorrecta');

    await vi.waitFor(() => {
      expect(document.querySelector('#auth-error').hidden).toBe(false);
    });
    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(document.querySelector('#auth-screen').hidden).toBe(false);

    await formaAutenticacion(username, password);

    await vi.waitFor(() => {
      expect(localStorage.getItem(SESSION_KEY)).toBe(username);
    });
    expect(document.querySelector('#app').hidden).toBe(false);
  });

  it('restaura una sesión guardada y la limpia al cerrar sesión', async () => {
    localStorage.setItem(USERS_KEY, JSON.stringify({ ana: { hash: 'saved-hash' } }));
    localStorage.setItem(SESSION_KEY, 'ana');
    await cargarApp();

    expect(document.querySelector('#auth-screen').hidden).toBe(true);
    expect(document.querySelector('#app').hidden).toBe(false);

    document.querySelector('#logout-button').click();

    expect(localStorage.getItem(SESSION_KEY)).toBeNull();
    expect(localStorage.getItem(USERS_KEY)).not.toBeNull();
    expect(document.querySelector('#auth-screen').hidden).toBe(false);
    expect(document.querySelector('#app').hidden).toBe(true);
  });
});
