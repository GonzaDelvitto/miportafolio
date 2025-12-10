// ====================================
// VARIABLES GLOBALES
// ====================================
let projectsData = [];
let currentFilter = 'all';

// ====================================
// INICIALIZACIÓN
// ====================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    loadProjects();
    loadTechnologies();
    initContactForm();
    initScrollEffects();
});

// ====================================
// NAVEGACIÓN
// ====================================
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const header = document.getElementById('header');

    // Toggle del menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Scroll effect en header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth scroll para todos los enlaces
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ====================================
// CARGAR PROYECTOS
// ====================================
async function loadProjects() {
    try {
        const response = await fetch('json/projects.json');
        const data = await response.json();
        projectsData = data.projects;
        renderProjects(projectsData);
        initProjectFilters();
    } catch (error) {
        console.error('Error cargando proyectos:', error);
        document.getElementById('projects-grid').innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">
                Error al cargar los proyectos
            </p>
        `;
    }
}

function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    
    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">
                No se encontraron proyectos en esta categoría
            </p>
        `;
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card fade-up-view">
            <div class="project-card__image">
                <img src="${project.image}" alt="${project.title}">
                <div class="project-card__overlay">
                    <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="overlay-btn" title="Ver demo">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                   
                </div>
            </div>
            <div class="project-card__content">
                <span class="project-card__category">${project.category}</span>
                <h3 class="project-card__title">${project.title}</h3>
                <p class="project-card__description">${project.description}</p>
                <div class="project-card__technologies">
                    ${project.technologies.map(tech => `
                        <span class="tech-badge">${tech}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');

    // Reiniciar observer para nuevos elementos
    observeElements();
}

// ====================================
// FILTROS DE PROYECTOS
// ====================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar botón activo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrar proyectos
            const filter = button.getAttribute('data-filter');
            currentFilter = filter;
            
            const filteredProjects = filter === 'all' 
                ? projectsData 
                : projectsData.filter(project => project.category === filter);
            
            renderProjects(filteredProjects);
        });
    });
}

// ====================================
// CARGAR TECNOLOGÍAS
// ====================================
async function loadTechnologies() {
    try {
        const response = await fetch('json/projects.json');
        const data = await response.json();
        const technologies = data.technologies;
        
        const techGrid = document.getElementById('tech-grid');
        techGrid.innerHTML = technologies.map((tech, index) => `
            <div class="tech-tag stagger-item" style="animation-delay: ${index * 0.05}s">
                ${tech}
            </div>
        `).join('');
    } catch (error) {
        console.error('Error cargando tecnologías:', error);
    }
}

// ====================================
// FORMULARIO DE CONTACTO
// ====================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };
            
            console.log('Formulario enviado:', formData);
            
            // Mostrar mensaje de éxito
            alert('¡Mensaje enviado con éxito! (Esta es una demostración)\n\nDatos del formulario:\n' + 
                  `Nombre: ${formData.name}\n` +
                  `Email: ${formData.email}\n` +
                  `Mensaje: ${formData.message}`);
            
            // Limpiar formulario
            form.reset();
        });
    }
}

// ====================================
// EFECTOS DE SCROLL
// ====================================
function initScrollEffects() {
    observeElements();
}

function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: dejar de observar después de animar
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    // Observar elementos con animación
    const animatedElements = document.querySelectorAll(
        '.fade-in-view, .fade-up-view, .fade-in-left-view, .fade-in-right-view'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ====================================
// UTILIDADES
// ====================================

// Prevenir comportamiento por defecto en enlaces externos
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('http')) {
        // Los enlaces externos ya tienen target="_blank" en el HTML
    }
});

// Lazy loading para imágenes (si se necesita)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading nativo
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lozad.js/1.16.0/lozad.min.js';
    document.body.appendChild(script);
    
    script.onload = () => {
        const observer = lozad();
        observer.observe();
    };
}

// Detectar scroll para animaciones adicionales
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Determinar dirección del scroll
    if (scrollTop > lastScrollTop) {
        // Scrolling down
        document.body.classList.add('scrolling-down');
        document.body.classList.remove('scrolling-up');
    } else {
        // Scrolling up
        document.body.classList.add('scrolling-up');
        document.body.classList.remove('scrolling-down');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

// Console message
console.log('%c¡Hola! 👋', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('%c¿Te gusta este portafolio? Contacta conmigo para crear el tuyo.', 'font-size: 14px; color: #6b7280;');
