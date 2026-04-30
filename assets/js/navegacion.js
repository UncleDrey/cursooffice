document.addEventListener('DOMContentLoaded', function () {
    inicializarSidebar();
});

function inicializarSidebar() {
    var sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) return;

    // Calcular raíz correcta para GitHub Pages
    var path = window.location.pathname;
    var profundidad = (path.match(/\//g) || []).length;
    var raiz = '';
    for (var i = 1; i < profundidad; i++) {
        raiz += '../';
    }

    fetch(raiz + 'components/sidebar-curso.html')
        .then(function (response) {
            if (!response.ok) throw new Error('Error cargando sidebar');
            return response.text();
        })
        .then(function (html) {
            sidebarContainer.innerHTML = html;
            corregirRutasSidebar();
            inicializarEventosAcordeon();
            abrirRutaActual();
            inicializarEventosSidebar();
        })
        .catch(function (error) {
            console.error('Error cargando sidebar:', error);
        });
}

function corregirRutasSidebar() {
    var path = window.location.pathname;
    var profundidad = (path.match(/\//g) || []).length;
    var raiz = '';
    for (var i = 1; i < profundidad; i++) {
        raiz += '../';
    }

    // Corregir rutas de enlaces en el sidebar
    var enlaces = document.querySelectorAll('.sidebar-nav a[href^="pages/"]');
    enlaces.forEach(function (enlace) {
        var href = enlace.getAttribute('href');
        if (href && href.indexOf('pages/') === 0) {
            enlace.href = raiz + href;
        }
    });

    // Corregir rutas de iconos
    var iconos = document.querySelectorAll('.sidebar-nav img[src^="assets/"]');
    iconos.forEach(function (img) {
        var src = img.getAttribute('src');
        if (src && src.indexOf('assets/') === 0) {
            img.src = raiz + src;
        }
    });
}

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

function abrirRutaActual() {
    var paginaActual = window.location.pathname;
    var enlaces = document.querySelectorAll('.sidebar-nav a[href]');
    var enlaceActivo = null;

    enlaces.forEach(function (enlace) {
        var href = enlace.getAttribute('href');
        if (href) {
            // Limpiar la ruta para comparar
            var hrefLimpio = href.replace(/^\.\.\//g, '');
            if (paginaActual.indexOf(hrefLimpio) !== -1 && !enlace.classList.contains('sidebar-toggle')) {
                enlace.classList.add('active');
                enlaceActivo = enlace;
            }
        }
    });

    if (enlaceActivo) {
        var padre = enlaceActivo.closest('.sidebar-submenu');
        while (padre) {
            padre.classList.add('open');
            var id = padre.id.replace('submenu-', '');
            var toggle = document.querySelector('[data-group="' + id + '"]');
            if (toggle) {
                toggle.classList.add('open');
            }
            padre = padre.parentElement.closest('.sidebar-submenu');
        }
    }
}

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