/**
 * OfficeGas Eficiente - Navegación del Sidebar
 * Detecta el curso (Word/Excel/PowerPoint) y el nivel (basico/intermedio/avanzado)
 * por la URL y carga los ítems correspondientes
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
            configurarSidebar();
            inicializarEventosSidebar();
        })
        .catch(function (error) {
            console.error('Error:', error);
        });
}

function configurarSidebar() {
    var datos = detectarCursoYNivel();
    var navList = document.getElementById('sidebar-nav-list');
    var badge = document.getElementById('sidebar-curso-badge');
    var titulo = document.getElementById('sidebar-nivel-titulo');

    if (!navList || !badge || !titulo) return;

    badge.textContent = datos.curso;
    titulo.textContent = datos.nivel;

    var items = obtenerItems(datos.curso, datos.nivel);

    navList.innerHTML = '';
    items.forEach(function (item) {
        var li = document.createElement('li');

        if (item.subitems) {
            li.innerHTML = '<a href="' + item.href + '" class="sidebar-parent">' +
                '<img src="' + detectarRaiz() + 'assets/icons/chevron-right.svg" alt="" width="14" height="14">' +
                item.titulo + '</a>';

            var subList = document.createElement('ul');
            subList.className = 'sidebar-subitems';

            item.subitems.forEach(function (sub) {
                var subLi = document.createElement('li');
                subLi.innerHTML = '<a href="' + sub.href + '">' + sub.titulo + '</a>';
                subList.appendChild(subLi);
            });

            li.appendChild(subList);
        } else {
            li.innerHTML = '<a href="' + item.href + '">' +
                '<img src="' + detectarRaiz() + 'assets/icons/file-text.svg" alt="" width="18" height="18">' +
                item.titulo + '</a>';
        }

        navList.appendChild(li);
    });

    marcarItemActivo();
}

function detectarCursoYNivel() {
    var path = window.location.pathname.toLowerCase();

    var curso = 'Word';
    if (path.indexOf('/excel/') !== -1) curso = 'Excel';
    if (path.indexOf('/powerpoint/') !== -1) curso = 'PowerPoint';

    var nivel = 'Básico';
    if (path.indexOf('/intermedio/') !== -1) nivel = 'Intermedio';
    if (path.indexOf('/avanzado/') !== -1) nivel = 'Avanzado';

    return { curso: curso, nivel: nivel };
}

function obtenerItems(curso, nivel) {
    var raiz = detectarRaiz();
    var base = raiz + 'pages/' + curso.toLowerCase() + '/' + nivel.toLowerCase() + '/';

    var modulosWordBasico = [
        { titulo: 'Módulo 1: Entorno de Word', href: base + 'modulo-1-entorno-word.html' },
        { titulo: 'Módulo 2: Crear y guardar', href: base + 'modulo-2-crear-guardar.html' },
        { titulo: 'Módulo 3: Escritura y edición', href: base + 'modulo-3-escritura-edicion.html' },
        { titulo: 'Módulo 4: Formato fuente y párrafo', href: base + 'modulo-4-formato-fuente.html' },
        { titulo: 'Módulo 5: Tablas básicas', href: base + 'modulo-5-tablas-basicas.html' },
        { titulo: 'Módulo 6: Imágenes y encabezado', href: base + 'modulo-6-imagenes-encabezado.html' },
        { titulo: 'Módulo 7: Impresión', href: base + 'modulo-7-configuracion-impresion.html' }
    ];

    var modulosWordIntermedio = [
        { titulo: 'Módulo 1: Estilos y temas', href: base + 'modulo-1-estilos-temas.html' },
        { titulo: 'Módulo 2: Tabla de contenido', href: base + 'modulo-2-tabla-contenido.html' },
        { titulo: 'Módulo 3: Carta formal', href: base + 'modulo-3-carta-formal.html' },
        { titulo: 'Módulo 4: Contratos de suministro GPL', href: base + 'modulo-4-contratos-gpl.html' },
        { titulo: 'Módulo 5: Correspondencia', href: base + 'modulo-5-correspondencia.html' },
        { titulo: 'Módulo 6: Combinar correspondencia', href: base + 'modulo-6-combinar-correspondencia.html' },
        { titulo: 'Módulo 7: Imagen corporativa', href: base + 'modulo-7-imagen-corporativa.html' }
    ];

    var modulosExcelBasico = [
        { titulo: 'Módulo 1: Entorno de Excel', href: base + 'modulo-1-entorno-excel.html' },
        { titulo: 'Módulo 2: Introducir y editar datos', href: base + 'modulo-2-introducir-datos.html' },
        { titulo: 'Módulo 3: Fórmulas básicas', href: base + 'modulo-3-formulas-basicas.html' },
        { titulo: 'Módulo 4: Formato de celdas', href: base + 'modulo-4-formato-celdas.html' },
        { titulo: 'Módulo 5: Ordenar y filtrar', href: base + 'modulo-5-ordenar-filtrar.html' },
        { titulo: 'Módulo 6: Gráficos de ventas', href: base + 'modulo-6-graficos-ventas.html' },
        { titulo: 'Módulo 7: Imprimir y guardar', href: base + 'modulo-7-imprimir-guardar.html' }
    ];

    var modulosExcelIntermedio = [
        { titulo: 'Módulo 1: Funciones SI y SI.CONJUNTO', href: base + 'modulo-1-funcion-si.html' },
        { titulo: 'Módulo 2: BUSCARV', href: base + 'modulo-2-buscarv.html' },
        { titulo: 'Módulo 3: Control de deudas y crédito', href: base + 'modulo-3-control-deudas.html' },
        { titulo: 'Módulo 4: SUMAR.SI y CONTAR.SI', href: base + 'modulo-4-sumar-si.html' },
        { titulo: 'Módulo 5: Formato condicional', href: base + 'modulo-5-formato-condicional.html' },
        { titulo: 'Módulo 6: Tablas dinámicas', href: base + 'modulo-6-tablas-dinamicas.html' },
        { titulo: 'Módulo 7: Dashboard de ventas GPL', href: base + 'modulo-7-dashboard-gpl.html' }
    ];

    var modulos;
    if (curso === 'Word' && nivel === 'Básico') modulos = modulosWordBasico;
    else if (curso === 'Word' && nivel === 'Intermedio') modulos = modulosWordIntermedio;
    else if (curso === 'Excel' && nivel === 'Básico') modulos = modulosExcelBasico;
    else if (curso === 'Excel' && nivel === 'Intermedio') modulos = modulosExcelIntermedio;
    else modulos = modulosWordBasico;

    return [
        {
            titulo: 'Temas',
            href: '#',
            subitems: modulos
        },
        {
            titulo: 'Ejercicios',
            href: '#',
            subitems: [
                { titulo: 'Ejercicio 1', href: base + 'ejercicios/ejercicio-1.html' },
                { titulo: 'Ejercicio 2', href: base + 'ejercicios/ejercicio-2.html' },
                { titulo: 'Ejercicio 3', href: base + 'ejercicios/ejercicio-3.html' }
            ]
        },
        {
            titulo: 'Examen',
            href: base + 'examen.html'
        }
    ];
}

function detectarRaiz() {
    var path = window.location.pathname;
    var profundidad = (path.match(/\//g) || []).length;

    if (profundidad <= 1) return '';
    if (profundidad <= 3) return '../';
    if (profundidad <= 4) return '../../';
    return '../../../';
}

function marcarItemActivo() {
    var paginaActual = window.location.pathname.split('/').pop();
    var enlaces = document.querySelectorAll('.sidebar-nav a');

    enlaces.forEach(function (enlace) {
        var href = enlace.getAttribute('href');
        if (href && href.indexOf(paginaActual) !== -1) {
            enlace.classList.add('active');
        }
    });
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

    var enlacesSidebar = sidebar.querySelectorAll('a');
    enlacesSidebar.forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });
}