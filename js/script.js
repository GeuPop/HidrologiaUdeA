const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxfW1pxPQxEbh1IDFsSZR5YXd3ZtErBJgZ6DlKgCPGuq9UXckzMrvCMW66TJQ1I0YCXhQ/exec';

// 🔄 Llamar a la API para obtener horas ocupadas
async function fetchTaken(tipo, fecha) {
  try {
    const res = await fetch(`${WEBAPP_URL}?action=list&tipo=${tipo}&fecha=${fecha}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data.taken || [];
  } catch (err) {
    console.error("Error al obtener horas ocupadas:", err);
    return [];
  }
}

// 🟢 Agendar una cita
async function submitForm(data) {
  try {
    const res = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', ...data })
    });

    const result = await res.json();

    if (result.status === 'ok') {
      alert(`Cita agendada con éxito. ID: ${result.id}`);
    } else {
      alert("Hubo un error al agendar la cita.");
    }
  } catch (err) {
    console.error("Error al enviar formulario:", err);
    alert("Error al conectar con el servidor.");
  }
}

// 🔴 Eliminar cita
async function deleteCita(id) {
  try {
    const res = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id })
    });

    const result = await res.json();
    if (result.status === 'deleted') {
      alert("Cita eliminada correctamente.");
    } else {
      alert("No se encontró la cita.");
    }
  } catch (err) {
    console.error("Error al eliminar cita:", err);
    alert("Error de conexión.");
  }
}

// 📅 Actualizar horas disponibles al cambiar fecha o tipo
document.querySelector('#fecha, #tipo').addEventListener('change', async () => {
  const tipo = document.querySelector('#tipo').value;
  const fecha = document.querySelector('#fecha').value;
  const taken = await fetchTaken(tipo, fecha);

  const selectHora = document.querySelector('#hora');
  Array.from(selectHora.options).forEach(option => {
    option.disabled = taken.includes(option.value);
  });
});

// 📨 Enviar formulario
document.querySelector('#formulario').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.querySelector('#nombre').value,
    email: document.querySelector('#email').value,
    fecha: document.querySelector('#fecha').value,
    hora: document.querySelector('#hora').value,
    taller: document.querySelector('#tipo').value === 'taller',
    boni: document.querySelector('#tipo').value === 'boni'
  };

  await submitForm(data);
});
