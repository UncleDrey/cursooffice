/**
 * OfficeGas Eficiente - Ejercicios interactivos
 * Validación de ejercicios de arrastrar y soltar, relacionar y completar
 */

/**
 * Verifica el ejercicio de arrastrar etiquetas a zonas
 * @param {string} ejercicioId - ID del contenedor del ejercicio
 * @param {string} resultadoId - ID del elemento donde mostrar resultado
 */
function verificarArrastre(ejercicioId, resultadoId) {
    var zonas = document.querySelectorAll('#' + ejercicioId + ' .zona-drop');
    var resultado = document.getElementById(resultadoId);
    var aciertos = 0;
    var total = zonas.length;

    zonas.forEach(function (zona) {
        var respuestaCorrecta = zona.getAttribute('data-respuesta');
        var etiquetaDentro = zona.querySelector('.etiqueta');

        if (etiquetaDentro && etiquetaDentro.getAttribute('data-valor') === respuestaCorrecta) {
            zona.classList.add('correcto');
            zona.classList.remove('incorrecto');
            aciertos++;
        } else if (etiquetaDentro) {
            zona.classList.add('incorrecto');
            zona.classList.remove('correcto');
        } else {
            zona.classList.remove('correcto', 'incorrecto');
        }
    });

    if (aciertos === total) {
        resultado.textContent = 'Excelente. Has identificado todas las partes correctamente.';
        resultado.className = 'resultado-ejercicio exito';
    } else if (aciertos > 0) {
        resultado.textContent = 'Has acertado ' + aciertos + ' de ' + total + '. Revisa las zonas marcadas en rojo e inténtalo de nuevo.';
        resultado.className = 'resultado-ejercicio error';
    } else {
        resultado.textContent = 'Arrastra las etiquetas a las zonas correspondientes y pulsa Verificar.';
        resultado.className = 'resultado-ejercicio';
    }
}

/**
 * Verifica preguntas de opción múltiple
 * @param {string} preguntaId - ID base de la pregunta (sin número)
 * @param {number} numeroPregunta - Número de pregunta
 * @param {string} respuestaCorrecta - Valor de la respuesta correcta
 * @param {string} resultadoId - ID del elemento donde mostrar resultado
 */
function verificarOpcionMultiple(preguntaId, respuestaCorrecta, resultadoId) {
    var seleccionada = document.querySelector('input[name="' + preguntaId + '"]:checked');
    var resultado = document.getElementById(resultadoId);

    if (!seleccionada) {
        resultado.textContent = 'Selecciona una respuesta antes de verificar.';
        resultado.className = 'resultado-ejercicio';
        return;
    }

    if (seleccionada.value === respuestaCorrecta) {
        resultado.textContent = 'Correcto. Bien hecho.';
        resultado.className = 'resultado-ejercicio exito';
    } else {
        resultado.textContent = 'Incorrecto. La respuesta correcta es: ' + respuestaCorrecta + '. Revisa el contenido del módulo.';
        resultado.className = 'resultado-ejercicio error';
    }
}

/**
 * Verifica completar espacios en blanco
 * @param {string} ejercicioId - ID del contenedor del ejercicio
 * @param {Array} respuestasCorrectas - Array de respuestas correctas
 * @param {string} resultadoId - ID del elemento donde mostrar resultado
 */
function verificarCompletar(ejercicioId, respuestasCorrectas, resultadoId) {
    var inputs = document.querySelectorAll('#' + ejercicioId + ' input[type="text"]');
    var resultado = document.getElementById(resultadoId);
    var aciertos = 0;
    var total = respuestasCorrectas.length;

    inputs.forEach(function (input, index) {
        var valorUsuario = input.value.trim().toLowerCase();
        var valorCorrecto = respuestasCorrectas[index].toLowerCase();

        if (valorUsuario === valorCorrecto) {
            input.classList.add('correcto');
            input.classList.remove('incorrecto');
            aciertos++;
        } else {
            input.classList.add('incorrecto');
            input.classList.remove('correcto');
        }
    });

    resultado.textContent = 'Has acertado ' + aciertos + ' de ' + total + ' espacios.';
    resultado.className = 'resultado-ejercicio ' + (aciertos === total ? 'exito' : 'error');
}

/**
 * Inicializa el arrastre de etiquetas
 */
document.addEventListener('DOMContentLoaded', function () {
    inicializarArrastre();
});

function inicializarArrastre() {
    var etiquetas = document.querySelectorAll('.etiqueta[draggable="true"]');
    var zonas = document.querySelectorAll('.zona-drop');

    etiquetas.forEach(function (etiqueta) {
        etiqueta.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('text/plain', etiqueta.getAttribute('data-valor'));
            etiqueta.classList.add('arrastrando');
        });

        etiqueta.addEventListener('dragend', function () {
            etiqueta.classList.remove('arrastrando');
        });
    });

    zonas.forEach(function (zona) {
        zona.addEventListener('dragover', function (e) {
            e.preventDefault();
            zona.classList.add('sobre');
        });

        zona.addEventListener('dragleave', function () {
            zona.classList.remove('sobre');
        });

        zona.addEventListener('drop', function (e) {
            e.preventDefault();
            zona.classList.remove('sobre');

            var valor = e.dataTransfer.getData('text/plain');
            var etiquetaArrastrada = document.querySelector('.etiqueta[data-valor="' + valor + '"]');

            // Buscar si ya hay una etiqueta en esta zona y devolverla
            var etiquetaExistente = zona.querySelector('.etiqueta');
            if (etiquetaExistente) {
                var contenedorEtiquetas = document.querySelector('.etiquetas-arrastrar');
                contenedorEtiquetas.appendChild(etiquetaExistente);
            }

            // Mover etiqueta a la zona
            if (etiquetaArrastrada) {
                zona.appendChild(etiquetaArrastrada);
            }

            // Limpiar clases de resultado
            zona.classList.remove('correcto', 'incorrecto');
        });
    });
}