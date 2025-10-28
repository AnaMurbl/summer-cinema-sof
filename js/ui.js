// ===============================
// UI.JS - Renderizado de interfaz
// ===============================

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Crear tarjeta de película
 * @param {Object} film - Datos de la película
 * @returns {HTMLElement} Elemento de la tarjeta
 */
export function createMovieCard(film) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `title-${film.id}`);

  // Imagen o placeholder
  const posterHTML = film.image
    ? `<img src="${escapeHtml(film.image)}"
            alt="Póster de ${escapeHtml(film.title)}"
            class="movie-poster"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
       <div class="movie-poster-placeholder" style="display: none;" aria-hidden="true">🎬</div>`
    : `<div class="movie-poster-placeholder" aria-hidden="true">🎬</div>`;

  card.innerHTML = `
    ${posterHTML}
    <div class="movie-content">
      <h3 id="title-${film.id}" class="movie-title">${escapeHtml(film.title)}</h3>
      <p class="movie-director">${escapeHtml(film.director)}</p>
      <p class="movie-description">${escapeHtml(film.description)}</p>

      <div class="movie-actions" role="group" aria-label="Acciones para ${escapeHtml(film.title)}">
        <button class="btn btn-edit"
                data-film-id="${film.id}"
                aria-label="Editar ${escapeHtml(film.title)}">
          Editar
        </button>
        <button class="btn btn-delete"
                data-film-id="${film.id}"
                aria-label="Eliminar ${escapeHtml(film.title)}">
          Eliminar
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Renderizar lista de películas
 * @param {Array} films - Array de películas
 * @param {string} viewMode - 'grid' o 'carousel'
 */
export function displayFilms(films, viewMode = 'grid') {
  const container = document.getElementById('films-container');

  if (!container) {
    console.error('Contenedor de películas no encontrado');
    return;
  }

  // Limpiar contenedor
  container.innerHTML = '';

  // Actualizar clase según vista
  container.className = viewMode === 'grid' ? 'films-grid' : 'films-carousel';

  // Si no hay películas
  if (films.length === 0) {
    container.innerHTML = '<div class="no-movies">No hay películas registradas</div>';
    return;
  }

  // Crear y añadir tarjetas
  films.forEach(film => {
    const card = createMovieCard(film);
    container.appendChild(card);
  });

  // Anunciar a lectores de pantalla
  announceToScreenReader(`${films.length} películas cargadas`);
}

/**
 * Mostrar estado de carga
 */
export function showLoading() {
  const container = document.getElementById('films-container');
  if (container) {
    container.innerHTML = '<div class="loading">Cargando películas...</div>';
  }
}

/**
 * Mostrar notificación
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - 'success' o 'error'
 */
export function showNotification(message, type = 'success') {
  // Remover notificación anterior si existe
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remover después de 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

/**
 * Anunciar mensaje a lectores de pantalla
 * @param {string} message - Mensaje a anunciar
 */
export function announceToScreenReader(message) {
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = message;
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

/**
 * Mostrar/ocultar modal
 * @param {string} modalId - ID del modal
 * @param {boolean} show - true para mostrar, false para ocultar
 */
export function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modal-overlay');

  if (!modal || !overlay) return;

  if (show) {
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus en el primer input
    setTimeout(() => {
      const firstInput = modal.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 100);
  } else {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');

    // Limpiar formulario si existe
    const form = modal.querySelector('form');
    if (form) form.reset();
  }
}

/**
 * Rellenar formulario de edición
 * @param {Object} film - Datos de la película
 */
export function fillEditForm(film) {
  document.getElementById('edit-id').value = film.id;
  document.getElementById('edit-title').value = film.title;
  document.getElementById('edit-director').value = film.director;
  document.getElementById('edit-image').value = film.image || '';
  document.getElementById('edit-description').value = film.description;
}
