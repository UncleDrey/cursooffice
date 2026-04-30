/**
 * OfficeGas - Script principal
 * Carga de componentes reutilizables y funcionalidades globales
 */

document.addEventListener('DOMContentLoaded', function () {
    cargarComponentes();
});

/**
 * Carga todos los componentes de la página
 */
function cargarComponentes() {
    var raiz = detectarRaiz();

    cargarComponente('header-container', raiz + 'components/header.html');
    cargarComponente('footer-container', raiz + 'components/footer.html');

    setTimeout(function () {
        marcarEnlaceActivo();
        inicializarDropdownMovil();
    }, 300);
}

/**
 * Detecta la raíz relativa del proyecto según la profundidad de la URL
 * @returns {string} Ruta relativa ('', '../', '../../', '../../../')
 */
function detectarRaiz() {
    var path = window.location.pathname;
    var profundidad = (path.match(/\//g) || []).length;

    // Raíz: /
    if (profundidad <= 1) return '';

    // Nivel 1: /pages/word/index.html
    if (profundidad === 2) return '../';

    // Nivel 2: /pages/word/basico/modulo-1.html
    if (profundidad === 3) return '../../';

    // Nivel 3: /pages/word/basico/ejercicios/ejercicio-1.html
    return '../../../';
}

/**
 * Carga un componente HTML externo en un contenedor
 * @param {string} containerId - ID del elemento contenedor
 * @param {string} url - Ruta del archivo HTML del componente
 */
function cargarComponente(containerId, url) {
    var container = document.getElementById(containerId);

    if (!container) {
        console.warn('Contenedor no encontrado: #' + containerId);
        return;
    }

    fetch(url)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Error ' + response.status + ' al cargar: ' + url);
            }
            return response.text();
        })
        .then(function (html) {
            container.innerHTML = html;
        })
        .catch(function (error) {
            console.error('Error cargando componente:', error.message);

            if (containerId === 'header-container') {
                container.innerHTML = obtenerHeaderRespaldo();
            } else if (containerId === 'footer-container') {
                container.innerHTML = obtenerFooterRespaldo();
            } else if (containerId === 'sidebar-container') {
                container.innerHTML = obtenerSidebarRespaldo();
            } else {
                container.innerHTML = '<p style="color: #c53030; padding: 1rem;">Error al cargar el componente.</p>';
            }
        });
}

/**
 * Marca el enlace activo en la navegación según la página actual
 */
function marcarEnlaceActivo() {
    var paginaActual = window.location.pathname;

    // Marcar Inicio
    var enlaces = document.querySelectorAll('.nav-link');
    enlaces.forEach(function (enlace) {
        enlace.classList.remove('active');
        var href = enlace.getAttribute('href');

        if (href === 'index.html' && (paginaActual === '/' || paginaActual.endsWith('index.html') || paginaActual.endsWith('/'))) {
            enlace.classList.add('active');
        } else if (href && href !== '#' && href !== 'index.html' && paginaActual.indexOf(href.replace('.html', '')) !== -1) {
            enlace.classList.add('active');
        }
    });

    // Marcar Cursos como activo si estamos en Word, Excel o PowerPoint
    if (paginaActual.indexOf('/word/') !== -1 ||
        paginaActual.indexOf('/excel/') !== -1 ||
        paginaActual.indexOf('/powerpoint/') !== -1) {
        var dropdownToggle = document.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.classList.add('active');
        }
    }
}

/**
 * Inicializa el dropdown de Cursos en dispositivos móviles
 */
function inicializarDropdownMovil() {
    var dropdownToggle = document.querySelector('.dropdown-toggle');
    if (!dropdownToggle) return;

    dropdownToggle.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            var menu = document.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        }
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            var dropdown = document.querySelector('.nav-dropdown');
            var menu = document.querySelector('.dropdown-menu');
            if (dropdown && menu && !dropdown.contains(e.target)) {
                menu.style.display = 'none';
            }
        }
    });
}

/**
 * Header de respaldo si falla la carga
 * @returns {string} HTML del header
 */
function obtenerHeaderRespaldo() {
    return '<header class="site-header">' +
        '<a href="index.html" class="header-logo">' +
        '<span>Office<strong>Gas</strong></span>' +
        '</a>' +
        '<nav class="nav-principal">' +
        '<a href="index.html">Inicio</a>' +
        '<a href="pages/word/index.html">Word</a>' +
        '<a href="pages/excel/index.html">Excel</a>' +
        '</nav>' +
        '<a href="pages/login.html" class="header-login">' +
        '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' +
        '</svg>' +
        '</a>' +
        '</header>';
}

/**
 * Footer de respaldo si falla la carga
 * @returns {string} HTML del footer
 */
function obtenerFooterRespaldo() {
    return '<footer class="site-footer">' +
        '<p><strong>OfficeGas</strong> - Curso de Office para el sector gasero</p>' +
        '<p>Bombonas 23kg y 68kg | Precios en XAF</p>' +
        '</footer>';
}

/**
 * Sidebar de respaldo si falla la carga
 * @returns {string} HTML del sidebar
 */
function obtenerSidebarRespaldo() {
    return '<aside class="sidebar">' +
        '<div class="sidebar-header">' +
        '<h3>Menú de Navegación</h3>' +
        '</div>' +
        '<nav>' +
        '<ul class="sidebar-nav">' +
        '<li><a href="#">Módulo 1</a></li>' +
        '<li><a href="#">Módulo 2</a></li>' +
        '<li><a href="#">Módulo 3</a></li>' +
        '</ul>' +
        '</nav>' +
        '</aside>';
}