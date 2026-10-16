const STORAGE_KEY = "finanzapp-movimientos";
const form = document.querySelector("#movement-form");
const list = document.querySelector("#movement-list");
const emptyState = document.querySelector("#empty-state");
const dateInput = document.querySelector("#movement-date");

let movements = loadMovements();

dateInput.value = new Date().toISOString().slice(0, 10);
render();

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
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMovements() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(movements));
}

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
  const colors = { ingreso: "income", gasto: "expense", ahorro: "savings" };
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
