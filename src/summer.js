// summer.js - Archivo con funciones adicionales para efectos y funcionalidades

// ===== EFECTOS PARA EL FORMULARIO =====

// Función para agregar efectos de partículas al fondo
function createParticleEffect() {
    const container = document.querySelector('.form-container');
    
    // Crear partículas flotantes
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${3 + Math.random() * 4}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        container.appendChild(particle);
    }
}

// Función para agregar efecto de ondas al hacer click en el botón
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn-submit');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Función para validación avanzada del formulario
function enhancedFormValidation() {
    const form = document.getElementById('movieForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validación en tiempo real
        input.addEventListener('input', function() {
            validateField(this);
        });
        
        // Efecto de focus mejorado
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            validateField(this);
        });
    });
}

// Función para validar campos individuales
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Limpiar mensajes de error previos
    clearFieldError(field);
    
    // Validaciones específicas
    switch (fieldName) {
        case 'title':
            if (value.length < 2) {
                showFieldError(field, 'El título debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'director':
            if (value.length < 2) {
                showFieldError(field, 'El nombre del director debe tener al menos 2 caracteres');
                return false;
            }
            break;
            
        case 'year':
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            if (year < 1900 || year > currentYear + 5) {
                showFieldError(field, `El año debe estar entre 1900 y ${currentYear + 5}`);
                return false;
            }
            break;
            
        case 'rating':
            const rating = parseFloat(value);
            if (rating < 1 || rating > 10) {
                showFieldError(field, 'La calificación debe estar entre 1 y 10');
                return false;
            }
            break;
    }
    
    return true;
}

// Función para mostrar errores en los campos
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #ff6b6b;
        font-size: 0.8em;
        margin-top: 5px;
        animation: slideIn 0.3s ease-out;
    `;
    
    field.parentElement.appendChild(errorDiv);
    field.style.borderColor = '#ff6b6b';
}

// Función para limpiar errores de los campos
function clearFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = 'transparent';
}

// ===== EFECTOS PARA EL CAROUSEL =====

// Función para agregar efectos de carga suave
function addCarouselLoadingEffect() {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        // Observador para detectar cuando las tarjetas entran en vista
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observar todas las tarjetas
        const cards = carousel.querySelectorAll('.movie-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
    });
}

// Función para agregar navegación con teclado
function addKeyboardNavigation() {
    let currentCarousel = 'all';
    
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                if (e.ctrlKey) {
                    scrollCarousel(currentCarousel, -1);
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
                if (e.ctrlKey) {
                    scrollCarousel(currentCarousel, 1);
                    e.preventDefault();
                }
                break;
            case 'Tab':
                // Cambiar entre carousels con Tab + Shift
                if (e.shiftKey) {
                    currentCarousel = currentCarousel === 'all' ? 'favorites' : 'all';
                    highlightActiveCarousel(currentCarousel);
                    e.preventDefault();
                }
                break;
        }
    });
}

// Función para resaltar el carousel activo
function highlightActiveCarousel(carouselType) {
    const containers = document.querySelectorAll('.carousel-container');
    containers.forEach(container => {
        container.style.border = '2px solid transparent';
    });
    
    const activeId = carouselType === 'favorites' ? 'favoritesCarousel' : 'allMoviesCarousel';
    const activeContainer = document.getElementById(activeId).parentElement;
    activeContainer.style.border = '2px solid #667eea';
}

// ===== FUNCIONES DE INICIALIZACIÓN =====

// Función para inicializar todos los efectos
function initializeSummerEffects() {
    // Agregar estilos CSS para las animaciones
    addCustomAnimations();
    
    // Inicializar efectos del formulario
    createParticleEffect();
    addRippleEffect();
    enhancedFormValidation();
    
    // Inicializar efectos del carousel
    addCarouselLoadingEffect();
    addKeyboardNavigation();
    
    // Mostrar mensaje de inicialización
    console.log('🌟 Summer.js efectos inicializados correctamente');
}

// Función para agregar animaciones CSS personalizadas
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes ripple {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-10px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .form-group.focused label {
            color: #667eea;
            transform: scale(1.1);
            transition: all 0.3s ease;
        }
        
        .btn-submit {
            position: relative;
            overflow: hidden;
        }
        
        .movie-card:hover {
            animation: pulse 0.6s ease-in-out;
        }
        
        .carousel-container:focus-within {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }
    `;
    
    document.head.appendChild(style);
}

// ===== FUNCIONES UTILITARIAS =====

// Función para guardar datos en localStorage (opcional)
function saveMoviesData() {
    try {
        localStorage.setItem('allMovies', JSON.stringify(allMovies));
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    } catch (error) {
        console.warn('No se pudo guardar en localStorage:', error);
    }
}

// Función para cargar datos desde localStorage (opcional)
function loadMoviesData() {
    try {
        const savedAllMovies = localStorage.getItem('allMovies');
        const savedFavoriteMovies = localStorage.getItem('favoriteMovies');
        
        if (savedAllMovies) {
            allMovies = JSON.parse(savedAllMovies);
        }
        
        if (savedFavoriteMovies) {
            favoriteMovies = JSON.parse(savedFavoriteMovies);
        }
    } catch (error) {
        console.warn('No se pudo cargar desde localStorage:', error);
    }
}

// Función para exportar películas como JSON
function exportMovies() {
    const dataStr = JSON.stringify({
        allMovies: allMovies,
        favoriteMovies: favoriteMovies,
        exportDate: new Date().toISOString()
    }, null, 2);
    
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peliculas_backup.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// ===== INICIALIZACIÓN AUTOMÁTICA =====

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que el HTML principal se cargue
    setTimeout(initializeSummerEffects, 100);
    
    // Cargar datos guardados (opcional)
    loadMoviesData();
    
    // Agregar listener para guardar datos automáticamente
    window.addEventListener('beforeunload', saveMoviesData);
});

// Función para limpiar efectos (útil para desarrollo)
function cleanupSummerEffects() {
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => particle.remove());
    
    const errors = document.querySelectorAll('.field-error');
    errors.forEach(error => error.remove());
    
    console.log('🧹 Summer.js efectos limpiados');
}
///////////////////////////////////////////


// Variables globales para almacenar las películas
        let allMovies = [];
        let favoriteMovies = [];

        // Función para crear una tarjeta de película
        function createMovieCard(movie, isFavorite = false) {
            const card = document.createElement('div');
            card.className = 'movie-card';
            card.innerHTML = `
                <h3>${movie.title}</h3>
                <p><strong>Director:</strong> ${movie.director}</p>
                <p><strong>Año:</strong> ${movie.year}</p>
                <p><strong>Género:</strong> ${movie.genre}</p>
                <p><strong>Calificación:</strong> ${movie.rating}/10</p>
                <p><strong>Descripción:</strong> ${movie.description}</p>
                <button onclick="toggleFavorite(${movie.id})" 
                        style="margin-top: 10px; padding: 8px 15px; background: ${isFavorite ? '#ff6b6b' : '#667eea'}; 
                               color: white; border: none; border-radius: 5px; cursor: pointer;">
                    ${isFavorite ? '❤️ Quitar de Favoritos' : '🤍 Agregar a Favoritos'}
                </button>
                 <button class="btn-edit" onclick="editFilm('${movie.id}', '${escapeForJs(movie.title)}', '${escapeForJs(movie.director)}', '${escapeForJs(movie.description)}')">
            ✏️ Editar
        </button>
        <button class="btn-delete" onclick="confirmDeleteFilm('${movie.id}', '${escapeForJs(movie.title)}')">
            🗑️ Eliminar
        </button>
            `;
            return card;
        }

        // Función para renderizar las películas en el carousel
        function renderMovies() {
            const allCarousel = document.getElementById('allMoviesCarousel');
            const favoritesCarousel = document.getElementById('favoritesCarousel');

            // Limpiar carousels
            allCarousel.innerHTML = '';
            favoritesCarousel.innerHTML = '';

            // Renderizar todas las películas
            if (allMovies.length === 0) {
                allCarousel.innerHTML = '<div class="no-movies">No hay películas registradas</div>';
            } else {
                allMovies.forEach(movie => {
                    const isFavorite = favoriteMovies.some(fav => fav.id === movie.id);
                    allCarousel.appendChild(createMovieCard(movie, isFavorite));
                });
            }

            // Renderizar películas favoritas
            if (favoriteMovies.length === 0) {
                favoritesCarousel.innerHTML = '<div class="no-movies">No hay películas favoritas aún</div>';
            } else {
                favoriteMovies.forEach(movie => {
                    favoritesCarousel.appendChild(createMovieCard(movie, true));
                });
            }

            // Actualizar indicadores
            updateIndicators();
        }

        // Función para manejar el envío del formulario
        document.getElementById('movieForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const movie = {
                id: Date.now(), // ID único basado en timestamp
                title: formData.get('title'),
                director: formData.get('director'),
                year: parseInt(formData.get('year')),
                genre: formData.get('genre'),
                rating: parseFloat(formData.get('rating')),
                description: formData.get('description')
            };

            // Agregar película a la lista
            allMovies.push(movie);
            
            // Limpiar formulario
            e.target.reset();
            
            // Actualizar la vista
            renderMovies();
            
            // Mostrar mensaje de éxito
            alert('¡Película agregada exitosamente!');
        });

        // Función para alternar favoritos
        function toggleFavorite(movieId) {
            const movie = allMovies.find(m => m.id === movieId);
            const favoriteIndex = favoriteMovies.findIndex(f => f.id === movieId);
            
            if (favoriteIndex === -1) {
                // Agregar a favoritos
                favoriteMovies.push(movie);
            } else {
                // Quitar de favoritos
                favoriteMovies.splice(favoriteIndex, 1);
            }
            
            renderMovies();
        }

        // Función para navegar en el carousel
        function scrollCarousel(type, direction) {
            const carouselId = type === 'favorites' ? 'favoritesCarousel' : 'allMoviesCarousel';
            const carousel = document.getElementById(carouselId);
            const cardWidth = 300; // Ancho de la tarjeta + gap
            
            carousel.scrollBy({
                left: direction * cardWidth,
                behavior: 'smooth'
            });
        }

        // Función para actualizar indicadores
        function updateIndicators() {
            // Esta función se puede expandir para mostrar indicadores de posición
            // Por ahora está vacía pero preparada para futuras mejoras
        }

        // Función para desplazarse a una película específica
        function scrollToMovie(carouselId, index) {
            const carousel = document.getElementById(carouselId);
            const cardWidth = 300;
            
            carousel.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        }

        // Inicializar la aplicación
        document.addEventListener('DOMContentLoaded', function() {
            renderMovies();
        });