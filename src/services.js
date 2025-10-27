// services.js - CRUD mejorado con integración de carousel

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
    carousel.innerHTML = '<div class="no-movies">No hay películas registradas</div>';
    return;
  }

  // Crear tarjetas de películas
  films.forEach(film => {
    const movieCard = createMovieCard(film);
    carousel.appendChild(movieCard);
  });
}

// Crear tarjeta de película
function createMovieCard(film) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <h3>${escapeHtml(film.title)}</h3>
    <p><strong>Director:</strong> ${escapeHtml(film.director)}</p>
    <p class="description">${escapeHtml(film.description)}</p>
    <div class="card-buttons">
      <button class="btn-edit" onclick="editFilm('${film.id}', '${escapeForJs(film.title)}', '${escapeForJs(film.director)}', '${escapeForJs(film.description)}')">
        ✏️ Editar
      </button>
      <button class="btn-delete" onclick="confirmDeleteFilm('${film.id}', '${escapeForJs(film.title)}')">
        🗑️ Eliminar
      </button>
    </div>
  `;
  return card;
}

// Mostrar el formulario de edición
function editFilm(id, title, director, description) {
  const updateForm = document.getElementById("updateForm");
  if (!updateForm) {
    console.error("No se encontró el formulario de edición");
    return;
  }

  // Mostrar el formulario de edición
  updateForm.classList.add('active');

  // Rellenar los campos con los datos actuales
  document.getElementById("updateId").value = id;
  document.getElementById("updateTitle").value = title;
  document.getElementById("updateDirector").value = director;
  document.getElementById("updateDescription").value = description;

  // Hacer scroll al formulario de edición
  updateForm.scrollIntoView({ behavior: 'smooth' });
}

// Ocultar el formulario de edición
function hideUpdateForm() {
  const updateForm = document.getElementById("updateForm");
  if (updateForm) {
    updateForm.classList.remove('active');

    // Limpiar los campos
    const form = document.getElementById("updateFormFields");
    if (form) {
      form.reset();
    }
  }
}

// Mostrar/ocultar formulario de agregar
function toggleAddForm() {
  const addFormSection = document.getElementById("add-film-section");
  if (addFormSection) {
    addFormSection.classList.toggle('active');

    // Si se está cerrando, limpiar el formulario
    if (!addFormSection.classList.contains('active')) {
      const form = document.getElementById("formFilm");
      if (form) {
        form.reset();
      }
    }
  }
}

// Confirmar antes de eliminar
function confirmDeleteFilm(id, title) {
  if (confirm(`¿Estás seguro de que quieres eliminar la película "${title}"?`)) {
    deleteFilm(id);
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

// Mostrar indicador de carga
function showLoading(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (carousel) {
    carousel.innerHTML = '<div class="loading">Procesando...</div>';
  }
}

// Mostrar notificación de éxito
function showSuccessMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'notification success';
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

// Mostrar notificación de error
function showErrorMessage(message) {
  const notification = document.createElement('div');
  notification.className = 'notification error';
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
        showErrorMessage("Por favor, completa todos los campos");
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
        showErrorMessage("Por favor, completa todos los campos");
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
