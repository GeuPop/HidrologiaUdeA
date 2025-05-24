// URL de tu API de Google Apps Script (reemplázala con tu URL real)
const API_URL = 'https://script.google.com/macros/s/AKfycbxPs8bhrMtboAL1uCMkYH3rOFNZf_GlDuRRAFYoTRelPl8NZ08iWUqexWgQSOT2AqTYvQ/exec';

// Evitar caché del navegador
document.addEventListener('DOMContentLoaded', function() {
    // Forzar recarga sin caché
    if (performance.navigation.type === 1) {
        window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime();
    }

    initializeApp();
});

function initializeApp() {
    // Elementos del DOM
    const scheduleBtn = document.getElementById('scheduleBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const activityModal = document.getElementById('activityModal');
    const closeModal = document.querySelector('.close');
    const workshop2Btn = document.getElementById('workshop2Btn');
    const pythonBtn = document.getElementById('pythonBtn');
    const workshop2Form = document.getElementById('workshop2Form');
    const pythonForm = document.getElementById('pythonForm');
    const cancelForm = document.getElementById('cancelForm');
    const workshop2Back = document.getElementById('workshop2Back');
    const pythonBack = document.getElementById('pythonBack');
    const cancelBack = document.getElementById('cancelBack');
    const confirmation = document.getElementById('confirmation');
    const closeConfirmation = document.getElementById('closeConfirmation');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const workshop2Day = document.getElementById('workshop2Day');
    const workshop2Time = document.getElementById('workshop2Time');
    const pythonTime = document.getElementById('pythonTime');

    // Estado inicial - Solo mostrar botones principales
    hideAllForms();

    // Event Listeners
    scheduleBtn.addEventListener('click', showActivityModal);
    cancelBtn.addEventListener('click', showCancelForm);
    closeModal.addEventListener('click', hideAllForms);
    workshop2Btn.addEventListener('click', showWorkshop2Form);
    pythonBtn.addEventListener('click', showPythonForm);
    workshop2Back.addEventListener('click', showActivityModal);
    pythonBack.addEventListener('click', showActivityModal);
    cancelBack.addEventListener('click', hideAllForms);
    closeConfirmation.addEventListener('click', hideConfirmation);
    workshop2Day.addEventListener('change', handleDaySelection);
    
    // Form submissions
    document.getElementById('workshop2Form').addEventListener('submit', submitWorkshop2Form);
    document.getElementById('pythonForm').addEventListener('submit', submitPythonForm);
    document.getElementById('cancelAppointmentForm').addEventListener('submit', submitCancelForm);

    // Cargar horas disponibles para Python al iniciar
    loadPythonTimes();

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (event) => {
        if (event.target === activityModal) {
            hideAllForms();
        }
    });

    // Funciones de ayuda
    function hideAllForms() {
        document.querySelectorAll('.form-container, .modal').forEach(element => {
            element.classList.add('hidden');
        });
        activityModal.style.display = 'none';
        confirmation.classList.add('hidden');
    }

    function showActivityModal() {
        hideAllForms();
        activityModal.style.display = 'block';
    }

    function showWorkshop2Form() {
        hideAllForms();
        workshop2Form.classList.remove('hidden');
    }

    function showPythonForm() {
        hideAllForms();
        pythonForm.classList.remove('hidden');
    }

    function showCancelForm() {
        hideAllForms();
        cancelForm.classList.remove('hidden');
    }

    function hideConfirmation() {
        confirmation.classList.add('hidden');
    }

    function showConfirmation(message) {
        confirmationMessage.textContent = message;
        confirmation.classList.remove('hidden');
    }

    // Manejo de selección de fecha para Taller 2
    function handleDaySelection() {
        const selectedDay = this.value;
        if (selectedDay) {
            loadWorkshop2Times(selectedDay);
        } else {
            workshop2Time.disabled = true;
            workshop2Time.innerHTML = '<option value="">Primero seleccione un día</option>';
        }
    }

    // Cargar horarios disponibles para Taller 2
    async function loadWorkshop2Times(date) {
        try {
            workshop2Time.disabled = true;
            workshop2Time.innerHTML = '<option value="">Cargando horarios...</option>';
            
            const response = await fetch(`${API_URL}?action=getAvailableTimes&activity=Taller 2&date=${date}&nocache=${new Date().getTime()}`);
            
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (!data.success) throw new Error(data.message || 'Error al cargar horarios');
            
            workshop2Time.innerHTML = '<option value="">Seleccione una hora</option>';
            
            data.availableTimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                workshop2Time.appendChild(option);
            });
            
            workshop2Time.disabled = false;
        } catch (error) {
            console.error('Error:', error);
            workshop2Time.innerHTML = `<option value="">Error: ${error.message}</option>`;
        }
    }

    // Cargar horarios disponibles para Python
    async function loadPythonTimes() {
        try {
            pythonTime.innerHTML = '<option value="">Cargando horarios...</option>';
            
            const response = await fetch(`${API_URL}?action=getAvailableTimes&activity=Bonificación Python&date=2025-06-04&nocache=${new Date().getTime()}`);
            
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (!data.success) throw new Error(data.message || 'Error al cargar horarios');
            
            pythonTime.innerHTML = '<option value="">Seleccione una hora</option>';
            
            data.availableTimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                pythonTime.appendChild(option);
            });
        } catch (error) {
            console.error('Error:', error);
            pythonTime.innerHTML = `<option value="">Error: ${error.message}</option>`;
        }
    }

    // Enviar formulario Taller 2
    async function submitWorkshop2Form(e) {
        e.preventDefault();
        
        const names = document.getElementById('workshop2Names').value.trim();
        const day = workshop2Day.value;
        const time = workshop2Time.value;
        const email = document.getElementById('workshop2Email').value.trim();
        
        if (!names || !day || !time || !email) {
            alert('Por favor complete todos los campos');
            return;
        }

        const appointment = {
            activity: 'Taller 2',
            names: names,
            date: day,
            time: time,
            email: email
        };
        
        await bookAppointment(appointment);
    }

    // Enviar formulario Python
    async function submitPythonForm(e) {
        e.preventDefault();
        
        const names = document.getElementById('pythonNames').value.trim();
        const time = pythonTime.value;
        const email = document.getElementById('pythonEmail').value.trim();
        
        if (!names || !time || !email) {
            alert('Por favor complete todos los campos');
            return;
        }

        const appointment = {
            activity: 'Bonificación Python',
            names: names,
            date: '2025-06-04',
            time: time,
            email: email
        };
        
        await bookAppointment(appointment);
    }

    // Enviar formulario de cancelación
    async function submitCancelForm(e) {
        e.preventDefault();
        
        const email = document.getElementById('cancelEmail').value.trim();
        
        if (!email) {
            alert('Por favor ingrese su correo electrónico');
            return;
        }

        if (!confirm('¿Está seguro que desea cancelar su reserva?')) {
            return;
        }
        
        await cancelAppointment(email);
    }

    // Reservar cita
    async function bookAppointment(appointment) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'bookAppointment',
                    appointment: appointment,
                    nocache: new Date().getTime()
                })
            });
            
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (!data.success) throw new Error(data.message || 'Error al agendar');
            
            showConfirmation(
                `✅ Se ha agendado correctamente la sustentación de ${appointment.activity} para:\n\n` +
                `👥 ${appointment.names}\n` +
                `📅 ${formatDate(appointment.date)} a las ${appointment.time}\n\n` +
                `📧 Se ha enviado un correo de confirmación a ${appointment.email}`
            );
            
            // Resetear formularios y recargar horarios
            document.getElementById('workshop2Form').reset();
            document.getElementById('pythonForm').reset();
            workshop2Time.disabled = true;
            workshop2Time.innerHTML = '<option value="">Primero seleccione un día</option>';
            
            // Recargar horarios disponibles
            if (appointment.activity === 'Taller 2') {
                loadWorkshop2Times(appointment.date);
            } else {
                loadPythonTimes();
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al agendar: ${error.message}`);
        }
    }

    // Cancelar cita
    async function cancelAppointment(email) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'cancelAppointment',
                    email: email,
                    nocache: new Date().getTime()
                })
            });
            
            if (!response.ok) throw new Error('Error en la red');
            
            const data = await response.json();
            
            if (!data.success) throw new Error(data.message || 'Error al cancelar');
            
            showConfirmation(
                `🗑️ Se ha cancelado la reserva asociada al correo:\n\n` +
                `📧 ${email}\n\n` +
                `Se ha enviado un correo de confirmación.`
            );
            
            document.getElementById('cancelEmail').value = '';
            
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al cancelar: ${error.message}`);
        }
    }

    // Formatear fecha en español
    function formatDate(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    }
}