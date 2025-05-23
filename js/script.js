// script.js

// 1) Pega aquí la URL de tu Web App desplegada en Google Apps Script:
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycby8ZJwNIplQMu67I4FljM597g_m-FMzMcfNAFKDebjQmTqp3xtl7Wl0-YYNVKQcP1biYQ/exec';

// Elementos del DOM
const btnStart = document.getElementById('btn-start');
const formAgenda = document.getElementById('form-agenda');
const typeButtons = document.querySelectorAll('.btn-type');
const step2 = document.getElementById('step-2');
const selectFecha = document.getElementById('select-fecha');
const selectHora  = document.getElementById('select-hora');
const btnSubmit   = document.getElementById('btn-submit');
const inputNombre = document.getElementById('input-nombre');
const inputEmail  = document.getElementById('input-email');
const btnReset    = document.getElementById('btn-reset');
const btnDelete   = document.getElementById('btn-delete');
const formDelete  = document.getElementById('form-delete');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
const inputId     = document.getElementById('input-id');

let currentType = null;

// Definición de fechas y franjas
const slots = {
  taller: {
    fechas: ['2025-05-29', '2025-05-30'],
    horas: generateSlots('14:00', '17:00', 15)
  },
  boni: {
    fechas: ['2025-06-04'],
    horas: [
      ...generateSlots('14:00', '16:45', 15),
      ...generateSlots('18:00', '20:00', 15)
    ]
  }
};

// Función para generar intervalos de N minutos
function generateSlots(start, end, min) {
  const [h0, m0] = start.split(':').map(Number);
  const [h1, m1] = end.split(':').map(Number);
  let res = [];
  let cur = new Date(0,0,0,h0,m0), endD = new Date(0,0,0,h1,m1);
  while (cur <= endD) {
    let next = new Date(cur.getTime() + min * 60000);
    if (next > endD) break;
    res.push(
      `${cur.getHours().toString().padStart(2,'0')}:`+
      `${cur.getMinutes().toString().padStart(2,'0')} - `+
      `${next.getHours().toString().padStart(2,'0')}:`+
      `${next.getMinutes().toString().padStart(2,'0')}`
    );
    cur = next;
  }
  return res;
}

// Mostrar formulario de agendamiento
btnStart.onclick = () => {
  btnStart.classList.add('hidden');
  formAgenda.classList.remove('hidden');
};

// Selección de tipo de cita
typeButtons.forEach(btn => btn.onclick = () => {
  currentType = btn.dataset.type;
  // Poblar fechas
  selectFecha.innerHTML = slots[currentType].fechas
    .map(d => `<option value="${d}">${d}</option>`)
    .join('');
  // Mostrar siguiente paso
  step2.classList.remove('hidden');
  selectFecha.onchange();
});

// Al cambiar de fecha, recargar horas
selectFecha.onchange = () => {
  selectHora.innerHTML = slots[currentType].horas
    .map(h => `<option>${h}</option>`).join('');
};

// Confirmar cita
btnSubmit.onclick = async () => {
  const payload = {
    action: 'add',
    nombre: inputNombre.value,
    taller: currentType === 'taller',
    boni:   currentType === 'boni',
    fecha:  selectFecha.value,
    hora:   selectHora.value,
    email:  inputEmail.value
  };
  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  alert(`Cita confirmada. Tu ID es: ${json.id}`);
  btnReset.classList.remove('hidden');
};

// Volver al inicio
btnReset.onclick = () => location.reload();

// Mostrar formulario de eliminación
btnDelete.onclick = () => {
  btnDelete.classList.add('hidden');
  formDelete.classList.remove('hidden');
};

// Eliminar cita
btnDeleteConfirm.onclick = async () => {
  const payload = { action: 'delete', id: inputId.value };
  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  alert(json.status === 'deleted'
    ? 'Cita eliminada correctamente'
    : 'ID no encontrado');
  btnReset.classList.remove('hidden');
};

