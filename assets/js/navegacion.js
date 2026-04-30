/**
 * OfficeGas - Navegación del Sidebar con acordeón
 */

document.addEventListener('DOMContentLoaded', function () {
    inicializarSidebar();
});

function inicializarSidebar() {
    var sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    var raiz = detectarRaiz();

    fetch(raiz + 'components/sidebar-curso.html')
        .then(function (response) {
            if (!response.ok) throw new Error('Error cargando sidebar');
            return response.text();
        })
        .then(function (html) {
            sidebarContainer.innerHTML = html;
            inicializarEventosAcordeon();
            abrirRutaActual();
            inicializarEventosSidebar();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function detectarRaiz() {
    var path = window.location.pathname;
    var profundidad = (path.match(/\//g) || []).length;
    var raiz = '';
    for (var i = 1; i < profundidad; i++) {
        raiz += '../';
    }
    return raiz;
}

/**
 * Inicializa el comportamiento de acordeón (expandir/colapsar)
 */
function inicializarEventosAcordeon() {
    var toggles = document.querySelectorAll('.sidebar-toggle');

    toggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();

            var group = this.getAttribute('data-group');
            var submenu = document.getElementById('submenu-' + group);

            if (submenu) {
                submenu.classList.toggle('open');
                this.classList.toggle('open');
            }
        });
    });
}

/**
 * Abre automáticamente el acordeón hasta el módulo actual
 */
function abrirRutaActual() {
    var paginaActual = window.location.pathname;

    // Encontrar el enlace activo
    var enlaces = document.querySelectorAll('.sidebar-nav a[href]');
    var enlaceActivo = null;

    enlaces.forEach(function (enlace) {
        var href = enlace.getAttribute('href');
        if (href && paginaActual.indexOf(href.replace(/^\.\.\//g, '')) !== -1) {
            enlace.classList.add('active');
            enlaceActivo = enlace;
        }
    });

    // Abrir los padres del enlace activo
    if (enlaceActivo) {
        var padre = enlaceActivo.closest('.sidebar-submenu');
        while (padre) {
            padre.classList.add('open');

            // Buscar el toggle correspondiente
            var id = padre.id.replace('submenu-', '');
            var toggle = document.querySelector('[data-group="' + id + '"]');
            if (toggle) {
                toggle.classList.add('open');
            }

            padre = padre.parentElement.closest('.sidebar-submenu');
        }
    }
}

/**
 * Inicializa eventos del sidebar (toggle móvil, overlay)
 */
function inicializarEventosSidebar() {
    var toggleBtn = document.getElementById('sidebar-toggle-btn');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');

    if (!toggleBtn || !sidebar || !overlay) return;

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', function () {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    var enlacesSidebar = sidebar.querySelectorAll('a[href]:not(.sidebar-toggle)');
    enlacesSidebar.forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });
}