// services.js - CRUD mejorado con integración de carousel y ACCESIBILIDAD AA

// ===============================
// CONFIGURACIÓN DE API
// ===============================
const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${API_BASE_URL}/films`;


// ===============================
// OPERACIONES CRUD
// ===============================

// CREATE - Método POST
async function createFilm(newFilm) {
  try {
    showLoading('sofia-carousel');

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newFilm),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const createdFilm = await response.json();
    console.log("Película agregada correctamente:", createdFilm);

    // Actualizar la vista
    await loadAndDisplayFilms();

    // Mostrar mensaje de éxito
    showSuccessMessage("¡Película agregada exitosamente!");

    // Ocultar formulario
    toggleAddForm();

    // ACCESIBILIDAD: Anunciar acción completada
    announceToScreenReader(`La película ${newFilm.title} ha sido agregada`);

  } catch (error) {
    console.error("Error al crear la película:", error.message);
    showErrorMessage("Error al crear la película: " + error.message);
  }
}

// READ - Método GET
async function getFilms() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const filmData = await response.json();
    console.log("Películas obtenidas:", filmData);
    return filmData;

  } catch (error) {
    console.error("Error al obtener películas:", error.message);
    showErrorMessage("Error al cargar las películas: " + error.message);
    return [];
  }
}

// UPDATE - Método PUT
async function updateFilm(id, updatedFilm) {
  try {
    showLoading('sofia-carousel');

    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFilm),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Película actualizada:", data);

    // Actualizar la vista
    await loadAndDisplayFilms();

    // Ocultar formulario de edición
    hideUpdateForm();

    // Mostrar mensaje de éxito
    showSuccessMessage("¡Película actualizada exitosamente!");

    // ACCESIBILIDAD: Anunciar actualización
    announceToScreenReader(`La película ${updatedFilm.title} ha sido actualizada`);

  } catch (error) {
    console.error("Error al actualizar:", error.message);
    showErrorMessage("Error al actualizar la película: " + error.message);
  }
}

// DELETE - Método DELETE
async function deleteFilm(id) {
  try {
    showLoading('sofia-carousel');

    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log(`Película con id ${id} eliminada correctamente.`);

    // Actualizar la vista
    await loadAndDisplayFilms();

    // Mostrar mensaje de éxito
    showSuccessMessage("¡Película eliminada exitosamente!");

    // ACCESIBILIDAD: Mover foco al carousel después de eliminar
    const carousel = document.getElementById('sofia-carousel');
    if (carousel) {
      carousel.setAttribute('tabindex', '-1');
      carousel.focus();
      setTimeout(() => carousel.removeAttribute('tabindex'), 100);
    }

  } catch (error) {
    console.error("Error al eliminar película:", error);
    showErrorMessage("Error al eliminar la película: " + error.message);
  }
}


// ===============================
// RENDERIZADO DE UI
// ===============================

// Cargar y mostrar todas las películas
async function loadAndDisplayFilms() {
  try {
    const films = await getFilms();
    displayFilmsInCarousel(films);
  } catch (error) {
    console.error("Error al cargar y mostrar películas:", error);
    showErrorMessage("Error al mostrar las películas");
  }
}

// Mostrar películas en el carousel
function displayFilmsInCarousel(films) {
  const carousel = document.getElementById("sofia-carousel");

  if (!carousel) {
    console.error("Carousel element not found");
    return;
  }

  // Limpiar carousel
  carousel.innerHTML = "";

  if (films.length === 0) {
    carousel.innerHTML = '<div class="no-movies" role="status">No hay películas registradas</div>';
    return;
  }

  // ACCESIBILIDAD: Anunciar cantidad de películas cargadas
  announceToScreenReader(`${films.length} películas cargadas`);

  // Crear tarjetas de películas
  films.forEach(film => {
    const movieCard = createMovieCard(film);
    carousel.appendChild(movieCard);
  });
}

// Crear tarjeta de película - MEJORADO CON ACCESIBILIDAD
function createMovieCard(film) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  // ACCESIBILIDAD: Añadir article para semántica
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `title-${film.id}`);

  card.innerHTML = `
    <h3 id="title-${film.id}">${escapeHtml(film.title)}</h3>
    <p><strong>Director:</strong> ${escapeHtml(film.director)}</p>
    <p class="description">${escapeHtml(film.description)}</p>
    <div class="card-buttons" role="group" aria-label="Acciones para ${escapeHtml(film.title)}">
      <button
        class="btn-edit"
        onclick="editFilm('${film.id}', '${escapeForJs(film.title)}', '${escapeForJs(film.director)}', '${escapeForJs(film.description)}')"
        aria-label="Editar película ${escapeHtml(film.title)}">
        <span aria-hidden="true">✏️</span> Editar
      </button>
      <button
        class="btn-delete"
        onclick="confirmDeleteFilm('${film.id}', '${escapeForJs(film.title)}')"
        aria-label="Eliminar película ${escapeHtml(film.title)}">
        <span aria-hidden="true">🗑️</span> Eliminar
      </button>
    </div>
  `;
  return card;
}

// Mostrar el formulario de edición - MEJORADO CON ACCESIBILIDAD
function editFilm(id, title, director, description) {
  const updateForm = document.getElementById("updateForm");
  if (!updateForm) {
    console.error("No se encontró el formulario de edición");
    return;
  }

  // Mostrar el formulario de edición
  updateForm.classList.add('active');

  // ACCESIBILIDAD: Actualizar ARIA
  updateForm.setAttribute('aria-hidden', 'false');

  // Rellenar los campos con los datos actuales
  document.getElementById("updateId").value = id;
  document.getElementById("updateTitle").value = title;
  document.getElementById("updateDirector").value = director;
  document.getElementById("updateDescription").value = description;

  // ACCESIBILIDAD: Hacer scroll al formulario y mover foco al primer campo
  updateForm.scrollIntoView({ behavior: 'smooth' });

  setTimeout(() => {
    const firstInput = document.getElementById("updateTitle");
    if (firstInput) {
      firstInput.focus();
    }
  }, 300);

  // ACCESIBILIDAD: Anunciar que se abrió el formulario
  announceToScreenReader(`Formulario de edición abierto para ${title}`);
}

// Ocultar el formulario de edición - MEJORADO CON ACCESIBILIDAD
function hideUpdateForm() {
  const updateForm = document.getElementById("updateForm");
  if (updateForm) {
    updateForm.classList.remove('active');

    // ACCESIBILIDAD: Actualizar ARIA
    updateForm.setAttribute('aria-hidden', 'true');

    // Limpiar los campos
    const form = document.getElementById("updateFormFields");
    if (form) {
      form.reset();
    }

    // ACCESIBILIDAD: Devolver foco al carousel
    const carousel = document.getElementById('sofia-carousel');
    if (carousel) {
      carousel.setAttribute('tabindex', '-1');
      carousel.focus();
      setTimeout(() => carousel.removeAttribute('tabindex'), 100);
    }
  }
}

// Mostrar/ocultar formulario de agregar - MEJORADO CON ACCESIBILIDAD
function toggleAddForm() {
  const addFormSection = document.getElementById("add-film-section");
  const toggleButton = document.querySelector('.toggle-form-btn');

  if (addFormSection) {
    const isOpen = addFormSection.classList.toggle('active');

    // ACCESIBILIDAD: Actualizar ARIA
    addFormSection.setAttribute('aria-hidden', !isOpen);
    if (toggleButton) {
      toggleButton.setAttribute('aria-expanded', isOpen);
    }

    // Si se está cerrando, limpiar el formulario
    if (!isOpen) {
      const form = document.getElementById("formFilm");
      if (form) {
        form.reset();
      }

      // ACCESIBILIDAD: Devolver foco al botón
      if (toggleButton) {
        toggleButton.focus();
      }
    } else {
      // Si se está abriendo, mover foco al primer campo
      setTimeout(() => {
        const firstInput = document.getElementById("title");
        if (firstInput) {
          firstInput.focus();
        }
      }, 100);
    }
  }
}

// Confirmar antes de eliminar - MEJORADO CON ACCESIBILIDAD
function confirmDeleteFilm(id, title) {
  // ACCESIBILIDAD: Mensaje más descriptivo
  const confirmMessage = `¿Estás segura de que quieres eliminar la película "${title}"?\n\nEsta acción no se puede deshacer.`;

  if (confirm(confirmMessage)) {
    deleteFilm(id);
  } else {
    // ACCESIBILIDAD: Anunciar cancelación
    announceToScreenReader('Eliminación cancelada');
  }
}


// ===============================
// FUNCIONES AUXILIARES
// ===============================

// Escapar HTML para prevenir ataques XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Escapar JavaScript
function escapeForJs(text) {
  if (!text) return '';
  return text.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

// Mostrar indicador de carga - MEJORADO CON ACCESIBILIDAD
function showLoading(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (carousel) {
    carousel.innerHTML = '<div class="loading" role="status" aria-live="polite">Procesando...</div>';
  }
}

// ACCESIBILIDAD: Nueva función para anunciar cambios a lectores de pantalla
function announceToScreenReader(message) {
  const announcement = document.getElementById('sr-announcer');
  if (announcement) {
    announcement.textContent = message;
    // Limpiar después de 1 segundo
    setTimeout(() => {
      announcement.textContent = '';
    }, 1000);
  }
}

// Mostrar notificación de éxito - MEJORADO CON ACCESIBILIDAD
function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'notification success';

  // ACCESIBILIDAD: Atributos ARIA
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.setAttribute('aria-atomic', 'true');

  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Mostrar notificación de error - MEJORADO CON ACCESIBILIDAD
function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'notification error';

  // ACCESIBILIDAD: Atributos ARIA (assertive para errores)
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.setAttribute('aria-atomic', 'true');

  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f44336;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}


// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener("DOMContentLoaded", function() {
  // Agregar estilos para notificaciones
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ACCESIBILIDAD: Crear elemento oculto para anuncios a lectores de pantalla
  const srAnnouncer = document.createElement('div');
  srAnnouncer.id = 'sr-announcer';
  srAnnouncer.setAttribute('role', 'status');
  srAnnouncer.setAttribute('aria-live', 'polite');
  srAnnouncer.setAttribute('aria-atomic', 'true');
  srAnnouncer.className = 'sr-only';
  document.body.appendChild(srAnnouncer);

  // Event listener para el formulario de creación
  const createForm = document.getElementById("formFilm");
  if (createForm) {
    createForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const newFilm = {
        title: formData.get("title").trim(),
        director: formData.get("director").trim(),
        description: formData.get("description").trim(),
      };

      // Validar que los campos no estén vacíos
      if (!newFilm.title || !newFilm.director || !newFilm.description) {
        showErrorMessage("Por favor, completa todos los campos obligatorios");

        // ACCESIBILIDAD: Mover foco al primer campo vacío
        if (!newFilm.title) {
          document.getElementById("title")?.focus();
        } else if (!newFilm.director) {
          document.getElementById("director")?.focus();
        } else if (!newFilm.description) {
          document.getElementById("description")?.focus();
        }
        return;
      }

      createFilm(newFilm);
      e.target.reset();
    });
  }

  // Event listener para el formulario de actualización
  const updateForm = document.getElementById("updateFormFields");
  if (updateForm) {
    updateForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(e.target);
      const id = formData.get("updateId");
      const updatedFilm = {
        title: formData.get("updateTitle").trim(),
        director: formData.get("updateDirector").trim(),
        description: formData.get("updateDescription").trim(),
      };

      // Validar que los campos no estén vacíos
      if (!updatedFilm.title || !updatedFilm.director || !updatedFilm.description) {
        showErrorMessage("Por favor, completa todos los campos obligatorios");

        // ACCESIBILIDAD: Mover foco al primer campo vacío
        if (!updatedFilm.title) {
          document.getElementById("updateTitle")?.focus();
        } else if (!updatedFilm.director) {
          document.getElementById("updateDirector")?.focus();
        } else if (!updatedFilm.description) {
          document.getElementById("updateDescription")?.focus();
        }
        return;
      }

      updateFilm(id, updatedFilm);
    });
  }

  // Event listener para el botón de cancelar edición
  const cancelButton = document.getElementById("cancelUpdate");
  if (cancelButton) {
    cancelButton.addEventListener("click", function() {
      hideUpdateForm();
    });
  }

  // ACCESIBILIDAD: Event listener para la tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      // Cerrar formulario de edición si está abierto
      const updateForm = document.getElementById("updateForm");
      if (updateForm && updateForm.classList.contains('active')) {
        hideUpdateForm();
        return;
      }

      // Cerrar formulario de agregar si está abierto
      const addForm = document.getElementById("add-film-section");
      if (addForm && addForm.classList.contains('active')) {
        toggleAddForm();
        return;
      }
    }
  });

  // Cargar las películas al inicio
  loadAndDisplayFilms();
});

// ===== FUNCIONES GLOBALES PARA EL HTML =====
if (typeof window !== 'undefined') {
  window.editFilm = editFilm;
  window.confirmDeleteFilm = confirmDeleteFilm;
  window.deleteFilm = deleteFilm;
  window.toggleAddForm = toggleAddForm;
}
