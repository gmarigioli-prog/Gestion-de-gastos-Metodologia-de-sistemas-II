// @vitest-environment jsdom

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TextEncoder } from 'node:util';
import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SESSION_KEY = 'finanzapp-sesion';
const page = readFileSync(resolve(process.cwd(), 'public/index.html'), 'utf8');

async function cargarApp() {
  vi.resetModules();
  document.open();
  document.write(page);
  document.close();
  await import('../../public/app.js');
}

async function registroInicial(username) {
  document.querySelector('#auth-switch').click();
  document.querySelector('#auth-username').value = username;
  document.querySelector('#auth-password').value = 'example-password';
  document.querySelector('#auth-form').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );

  await vi.waitFor(() => {
    expect(localStorage.getItem(SESSION_KEY)).toBe(username);
  });
}

function anadirAccion({ type, description, amount }) {
  document.querySelector('#movement-type').value = type;
  document.querySelector('#movement-description').value = description;
  document.querySelector('#movement-amount').value = String(amount);
  document.querySelector('#movement-date').value = '2026-11-27';
  document.querySelector('#movement-form').dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true })
  );
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

describe('Deshacer movimientos', () => {
  it('restaura los estados anteriores y persiste cada deshacer', async () => {
    await registroInicial('ana');

    anadirAccion({ type: 'gasto', description: 'Comida', amount: 25 });
    anadirAccion({ type: 'ingreso', description: 'Sueldo', amount: 1000 });

    const storedMovementsKey = 'finanzapp-movimientos:ana';
    const savedMovements = JSON.parse(localStorage.getItem(storedMovementsKey));
    const undoButton = document.querySelector('#undo-button');
    expect(savedMovements.map(({ description }) => description)).toEqual(['Sueldo', 'Comida']);
    expect(undoButton.disabled).toBe(false);

    undoButton.click();

    expect(JSON.parse(localStorage.getItem(storedMovementsKey))).toEqual([savedMovements[1]]);
    expect(
      Array.from(document.querySelectorAll('.movement-description'), (node) => node.textContent)
    ).toEqual(['Comida']);
    expect(undoButton.disabled).toBe(false);

    undoButton.click();

    expect(JSON.parse(localStorage.getItem(storedMovementsKey))).toEqual([]);
    expect(document.querySelector('#movement-list').innerHTML).toBe('');
    expect(undoButton.disabled).toBe(true);
  });
});
