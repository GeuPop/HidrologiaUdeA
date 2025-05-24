document.addEventListener('DOMContentLoaded', function() {
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
    
    // URLs de la API de Google Apps Script
    const API_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI';
    
    // Cargar horas disponibles para Python (4 de junio)
    loadPythonTimes();
    
    // Event Listeners
    scheduleBtn.addEventListener('click', () => {
        activityModal.style.display = 'block';
    });
    
    cancelBtn.addEventListener('click', () => {
        hideAllForms();
        cancelForm.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', () => {
        activityModal.style.display = 'none';
    });
    
    workshop2Btn.addEventListener('click', () => {
        activityModal.style.display = 'none';
        hideAllForms();
        workshop2Form.classList.remove('hidden');
    });
    
    pythonBtn.addEventListener('click', () => {
        activityModal.style.display = 'none';
        hideAllForms();
        pythonForm.classList.remove('hidden');
    });
    
    workshop2Back.addEventListener('click', () => {
        hideAllForms();
        activityModal.style.display = 'block';
    });
    
    pythonBack.addEventListener('click', () => {
        hideAllForms();
        activityModal.style.display = 'block';
    });
    
    cancelBack.addEventListener('click', () => {
        hideAllForms();
    });
    
    closeConfirmation.addEventListener('click', () => {
        confirmation.classList.add('hidden');
    });
    
    // Cuando se selecciona un día para el Taller 2, cargar las horas disponibles
    document.getElementById('workshop2Day').addEventListener('change', function() {
        const selectedDay = this.value;
        const timeSelect = document.getElementById('workshop2Time');
        
        if (selectedDay) {
            timeSelect.disabled = false;
            loadWorkshop2Times(selectedDay);
        } else {
            timeSelect.disabled = true;
            timeSelect.innerHTML = '<option value="">Primero seleccione un día</option>';
        }
    });
    
    // Enviar formulario Taller 2
    document.getElementById('workshop2Form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const names = document.getElementById('workshop2Names').value;
        const day = document.getElementById('workshop2Day').value;
        const time = document.getElementById('workshop2Time').value;
        const email = document.getElementById('workshop2Email').value;
        
        const appointment = {
            activity: 'Taller 2',
            names: names,
            date: day,
            time: time,
            email: email
        };
        
        bookAppointment(appointment);
    });
    
    // Enviar formulario Python
    document.getElementById('pythonForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const names = document.getElementById('pythonNames').value;
        const time = document.getElementById('pythonTime').value;
        const email = document.getElementById('pythonEmail').value;
        
        const appointment = {
            activity: 'Bonificación Python',
            names: names,
            date: '2025-06-04',
            time: time,
            email: email
        };
        
        bookAppointment(appointment);
    });
    
    // Enviar formulario de cancelación
    document.getElementById('cancelAppointmentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('cancelEmail').value;
        
        cancelAppointment(email);
    });
    
    // Funciones auxiliares
    function hideAllForms() {
        workshop2Form.classList.add('hidden');
        pythonForm.classList.add('hidden');
        cancelForm.classList.add('hidden');
    }
    
    function loadWorkshop2Times(date) {
        fetch(`${API_URL}?action=getAvailableTimes&activity=Taller 2&date=${date}`)
            .then(response => response.json())
            .then(data => {
                const timeSelect = document.getElementById('workshop2Time');
                timeSelect.innerHTML = '<option value="">Seleccione una hora</option>';
                
                data.availableTimes.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    timeSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los horarios disponibles');
            });
    }
    
    function loadPythonTimes() {
        fetch(`${API_URL}?action=getAvailableTimes&activity=Bonificación Python&date=2025-06-04`)
            .then(response => response.json())
            .then(data => {
                const timeSelect = document.getElementById('pythonTime');
                timeSelect.innerHTML = '<option value="">Seleccione una hora</option>';
                
                data.availableTimes.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    timeSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al cargar los horarios disponibles');
            });
    }
    
    function bookAppointment(appointment) {
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'bookAppointment',
                appointment: appointment
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showConfirmation(`Se ha agendado correctamente la sustentación de ${appointment.activity} para ${appointment.names} el ${formatDate(appointment.date)} a las ${appointment.time}. Se ha enviado un correo de confirmación a ${appointment.email}.`);
                resetForms();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al agendar la cita');
        });
    }
    
    function cancelAppointment(email) {
        if (!confirm('¿Está seguro que desea cancelar la reserva asociada a este correo?')) {
            return;
        }
        
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'cancelAppointment',
                email: email
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showConfirmation(`Se ha cancelado la reserva asociada al correo ${email}. Se ha enviado un correo de confirmación.`);
                document.getElementById('cancelEmail').value = '';
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al cancelar la cita');
        });
    }
    
    function showConfirmation(message) {
        confirmationMessage.textContent = message;
        confirmation.classList.remove('hidden');
    }
    
    function resetForms() {
        document.getElementById('workshop2Form').reset();
        document.getElementById('pythonForm').reset();
        document.getElementById('workshop2Time').disabled = true;
        document.getElementById('workshop2Time').innerHTML = '<option value="">Primero seleccione un día</option>';
        hideAllForms();
    }
    
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }
});
