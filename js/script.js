// js/script.js

// 1) Pega aquí la URL de tu Web App desplegada en Google Apps Script:
const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycby8ZJwNIplQMu67I4FljM597g_m-FMzMcfNAFKDebjQmTqp3xtl7Wl0-YYNVKQcP1biYQ/exec';

// Genera franjas de N minutos entre start y end
function generateSlots(start, end, minutes) {
  const [h0, m0] = start.split(':').map(Number);
  const [h1, m1] = end.split(':').map(Number);
  let slots = [];
  let cur = new Date(0,0,0,h0,m0);
  const endDate = new Date(0,0,0,h1,m1);
  while (cur < endDate) {
    let next = new Date(cur.getTime() + minutes * 60000);
    slots.push(
      `${String(cur.getHours()).padStart(2,'0')}:${String(cur.getMinutes()).padStart(2,'0')} - ` +
      `${String(next.getHours()).padStart(2,'0')}:${String(next.getMinutes()).padStart(2,'0')}`
    );
    cur = next;
  }
  return slots;
}

// Definición de fechas y franjas fijas
const slotsConfig = {
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

// Helper para seleccionar IDs
const $ = id => document.getElementById(id);

let currentType = null;

// Paso 1: mostrar form de agendamiento
$('btn-start').onclick = () => {
  $('btn-start').classList.add('hidden');
  $('form-agenda').classList.remove('hidden');
};

// Paso 2: elegir tipo de cita
document.querySelectorAll('.btn-type').forEach(btn => {
  btn.onclick = () => {
    currentType = btn.dataset.type;
    // poblar fechas
    $('select-fecha').innerHTML = slotsConfig[currentType].fechas
      .map(d => `<option value="${d}">${d}</option>`).join('');
    // mostrar siguiente paso
    $('step-2').classList.remove('hidden');
    updateHoras();                       // cargar horas la primera vez
    $('select-fecha').onchange = updateHoras;
  };
});

// Consulta al API qué slots ya están ocupados
async function fetchTaken(tipo, fecha) {
  const res = await fetch(`${WEBAPP_URL}?action=list&tipo=${tipo}&fecha=${fecha}`);
  const json = await res.json();
  return json.taken || [];
}

// Rellena el select-hora filtrando los ocupados
async function updateHoras() {
  const fecha = $('select-fecha').value;
  const taken = await fetchTaken(currentType, fecha);
  $('select-hora').innerHTML = slotsConfig[currentType].horas
    .filter(h => !taken.includes(h))
    .map(h => `<option>${h}</option>`).join('');
}

// Confirmar y enviar cita
$('btn-submit').onclick = async () => {
  const payload = {
    action: 'add',
    nombre: $('input-nombre').value,
    taller: currentType === 'taller',
    boni:   currentType === 'boni',
    fecha:  $('select-fecha').value,
    hora:   $('select-hora').value,
    email:  $('input-email').value
  };
  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  alert(`Cita confirmada. Tu ID es: ${json.id}`);
  $('btn-reset').classList.remove('hidden');
};

// Eliminar cita
$('btn-delete').onclick = () => {
  $('btn-delete').classList.add('hidden');
  $('form-delete').classList.remove('hidden');
};
$('btn-delete-confirm').onclick = async () => {
  const payload = { action: 'delete', id: $('input-id').value };
  const res = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  alert(json.status === 'deleted'
    ? 'Cita eliminada correctamente'
    : 'ID no encontrado');
  $('btn-reset').classList.remove('hidden');
};

// Volver al inicio
$('btn-reset').onclick = () => location.reload();
