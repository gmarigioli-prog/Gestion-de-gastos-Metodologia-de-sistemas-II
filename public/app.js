const USERS_KEY = "finanzapp-usuarios";
const SESSION_KEY = "finanzapp-sesion";
const movementsKey = (username) => `finanzapp-movimientos:${username}`;

const authScreen = document.querySelector("#auth-screen");
const appScreen = document.querySelector("#app");
const authForm = document.querySelector("#auth-form");
const authError = document.querySelector("#auth-error");
const userLabel = document.querySelector("#user-label");
const logoutButton = document.querySelector("#logout-button");
const form = document.querySelector("#movement-form");
const list = document.querySelector("#movement-list");
const emptyState = document.querySelector("#empty-state");
const dateInput = document.querySelector("#movement-date");

let currentUser = null;
let movements = [];
let isRegisterMode = false;

/*  Sesion */

const savedUser = localStorage.getItem(SESSION_KEY);
if (savedUser && loadUsers()[savedUser]) {
  startApp(savedUser);
} else {
  showAuth();
}

document.querySelector("#auth-switch").addEventListener("click", () => {
  setAuthMode(!isRegisterMode);
});

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.querySelector("#auth-username").value.trim().toLowerCase();
  const password = document.querySelector("#auth-password").value;
  const users = loadUsers();
  const hash = await hashPassword(username, password);

  if (isRegisterMode) {
    if (users[username]) return showAuthError("Ese usuario ya existe.");
    users[username] = { hash };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } else if (!users[username] || users[username].hash !== hash) {
    return showAuthError("Usuario o contraseña incorrectos.");
  }

  localStorage.setItem(SESSION_KEY, username);
  authForm.reset();
  startApp(username);
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  currentUser = null;
  movements = [];
  showAuth();
});

function setAuthMode(register) {
  isRegisterMode = register;
  document.querySelector("#auth-title").textContent = register ? "Crear cuenta" : "Iniciar sesión";
  document.querySelector("#auth-submit").textContent = register ? "Registrarme" : "Ingresar";
  document.querySelector("#auth-switch-text").textContent = register ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?";
  document.querySelector("#auth-switch").textContent = register ? "Iniciá sesión" : "Registrate";
  document.querySelector("#auth-password").autocomplete = register ? "new-password" : "current-password";
  authError.hidden = true;
}

function showAuth() {
  setAuthMode(false);
  authScreen.hidden = false;
  appScreen.hidden = true;
  logoutButton.hidden = true;
  userLabel.textContent = "Demo local";
}

function showAuthError(message) {
  authError.textContent = message;
  authError.hidden = false;
}

function startApp(username) {
  currentUser = username;
  movements = loadMovements();
  authScreen.hidden = true;
  appScreen.hidden = false;
  logoutButton.hidden = false;
  userLabel.textContent = `Hola, ${username}`;
  dateInput.value = new Date().toISOString().slice(0, 10);
  render();
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

async function hashPassword(username, password) {
  const data = new TextEncoder().encode(`${username}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/* Movimientos por usuario */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const movement = {
    id: crypto.randomUUID(),
    type: document.querySelector("#movement-type").value,
    description: document.querySelector("#movement-description").value.trim(),
    amount: Number(document.querySelector("#movement-amount").value),
    date: dateInput.value
  };

  movements = [movement, ...movements];
  saveMovements();
  form.reset();
  dateInput.value = new Date().toISOString().slice(0, 10);
  render();
});

function loadMovements() {
  try {
    return JSON.parse(localStorage.getItem(movementsKey(currentUser))) || [];
  } catch {
    return [];
  }
}

function saveMovements() {
  localStorage.setItem(movementsKey(currentUser), JSON.stringify(movements));
}

/* Render */

function render() {
  const totals = movements.reduce((result, movement) => {
    result[movement.type] += movement.amount;
    return result;
  }, { ingreso: 0, gasto: 0, ahorro: 0 });

  document.querySelector("#income-total").textContent = formatMoney(totals.ingreso);
  document.querySelector("#expense-total").textContent = formatMoney(totals.gasto);
  document.querySelector("#savings-total").textContent = formatMoney(totals.ahorro);
  document.querySelector("#balance").textContent = formatMoney(totals.ingreso - totals.gasto - totals.ahorro);
  emptyState.hidden = movements.length > 0;
  list.innerHTML = movements.map(renderMovement).join("");
}

function renderMovement(movement) {
  const symbols = { ingreso: "+", gasto: "-", ahorro: "A" };
  const labels = { ingreso: "Ingreso", gasto: "Gasto", ahorro: "Ahorro" };
  const sign = movement.type === "gasto" ? "-" : "+";

  return `
    <div class="movement">
      <div class="movement-main">
        <span class="movement-icon ${movement.type}">${symbols[movement.type]}</span>
        <div>
          <div class="movement-description">${escapeHtml(movement.description)}</div>
          <div class="movement-date">${labels[movement.type]} · ${formatDate(movement.date)}</div>
        </div>
      </div>
      <span class="movement-amount ${movement.type}">${sign}${formatMoney(movement.amount)}</span>
    </div>
  `;
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}