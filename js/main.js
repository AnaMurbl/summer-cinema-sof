// ===============================
// MAIN.JS - Inicialización de la aplicación
// ===============================

import { getFilms } from './api.js';
import { displayFilms, showLoading, showNotification } from './ui.js';
import { initCarousel } from './carousel.js';
import { initForms } from './forms.js';

/**
 * Cargar y mostrar películas
 */
async function loadFilms() {
  try {
    showLoading();
    const films = await getFilms();
    displayFilms(films, 'grid'); // Iniciar en vista grid
  } catch (error) {
    showNotification('Error al cargar las películas', 'error');
  }
}

/**
 * Inicializar aplicación
 */
function init() {
  console.log('🎬 Cine de Verano - Iniciando aplicación');

  // Inicializar módulos
  initCarousel();
  initForms();

  // Cargar películas
  loadFilms();

  console.log('✅ Aplicación inicializada correctamente');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
