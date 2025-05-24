const API_URL = 'https://script.google.com/macros/s/TU_ID/exec';

// Función para cargar horarios (Actualizada)
async function loadWorkshop2Times(date) {
  const timeSelect = document.getElementById('workshop2Time');
  try {
    timeSelect.disabled = true;
    timeSelect.innerHTML = '<option value="">Cargando...</option>';

    // Nueva URL con parámetros codificados
    const url = new URL(API_URL);
    url.searchParams.append('action', 'getAvailableTimes');
    url.searchParams.append('activity', 'Taller 2');
    url.searchParams.append('date', date);
    url.searchParams.append('cache', Date.now());

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });

    const data = await response.json();
    
    if (!data.success) throw new Error(data.message);

    timeSelect.innerHTML = data.availableTimes.length > 0 
      ? '<option value="">Seleccione una hora</option>'
      : '<option value="">No hay horarios</option>';

    data.availableTimes.forEach(time => {
      const option = document.createElement('option');
      option.value = time;
      option.textContent = time;
      timeSelect.appendChild(option);
    });

  } catch (error) {
    console.error('Error:', error);
    timeSelect.innerHTML = `<option value="">Error: ${error.message}</option>`;
  } finally {
    timeSelect.disabled = false;
  }
}