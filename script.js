function calcular() {
    const lluvia = parseFloat(document.getElementById("lluvia").value);
    const tiempo = parseFloat(document.getElementById("tiempo").value);
    const mensaje = document.getElementById("mensaje");
    const resultado = document.getElementById("resultado");

    mensaje.classList.add("oculto");
    resultado.classList.add("oculto");

    if (isNaN(lluvia) || isNaN(tiempo) || tiempo <= 0) {
        mensaje.textContent = "Por favor ingresa valores válidos.";
        mensaje.classList.remove("oculto");
        return;
    }

    const intensidadMin = lluvia / tiempo;
    const intensidadHora = (lluvia / tiempo) * 60;

    resultado.innerHTML = `
        <strong>Resultados:</strong><br><br>
        • Intensidad: <strong>${intensidadMin.toFixed(2)} mm/min</strong><br>
        • Intensidad: <strong>${intensidadHora.toFixed(2)} mm/h</strong>
    `;

    resultado.classList.remove("oculto");
}
