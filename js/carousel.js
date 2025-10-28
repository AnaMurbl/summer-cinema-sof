// ===============================
// CAROUSEL.JS - Navegación del carousel
// ===============================

let currentView = 'grid';

/**
 * Inicializar controles del carousel
 */
export function initCarousel() {
  const gridBtn = document.getElementById('grid-view-btn');
  const carouselBtn = document.getElementById('carousel-view-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const navigation = document.getElementById('carousel-navigation');

  // Toggle entre grid y carousel
  gridBtn?.addEventListener('click', () => {
    switchView('grid');
    gridBtn.classList.add('active');
    gridBtn.setAttribute('aria-selected', 'true');
    carouselBtn.classList.remove('active');
    carouselBtn.setAttribute('aria-selected', 'false');
    if (navigation) navigation.style.display = 'none';
  });

  carouselBtn?.addEventListener('click', () => {
    switchView('carousel');
    carouselBtn.classList.add('active');
    carouselBtn.setAttribute('aria-selected', 'true');
    gridBtn.classList.remove('active');
    gridBtn.setAttribute('aria-selected', 'false');
    if (navigation) navigation.style.display = 'flex';
    updateNavigationButtons();
  });

  // Botones de navegación
  prevBtn?.addEventListener('click', () => scrollCarousel('left'));
  nextBtn?.addEventListener('click', () => scrollCarousel('right'));

  // Actualizar botones al hacer scroll
  const container = document.getElementById('films-container');
  container?.addEventListener('scroll', updateNavigationButtons);
}

/**
 * Cambiar vista entre grid y carousel
 * @param {string} view - 'grid' o 'carousel'
 */
function switchView(view) {
  currentView = view;
  const container = document.getElementById('films-container');

  if (container) {
    container.className = view === 'grid' ? 'films-grid' : 'films-carousel';
  }
}

/**
 * Desplazar carousel
 * @param {string} direction - 'left' o 'right'
 */
function scrollCarousel(direction) {
  const container = document.getElementById('films-container');
  if (!container) return;

  const scrollAmount = 320; // Ancho de tarjeta + gap
  const scrollValue = direction === 'left' ? -scrollAmount : scrollAmount;

  container.scrollBy({
    left: scrollValue,
    behavior: 'smooth'
  });

  // Actualizar botones después del scroll
  setTimeout(updateNavigationButtons, 300);
}

/**
 * Actualizar estado de botones de navegación
 */
function updateNavigationButtons() {
  if (currentView !== 'carousel') return;

  const container = document.getElementById('films-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  if (!container || !prevBtn || !nextBtn) return;

  const scrollLeft = container.scrollLeft;
  const maxScroll = container.scrollWidth - container.clientWidth;

  // Deshabilitar botón izquierdo si está al inicio
  if (scrollLeft <= 10) {
    prevBtn.disabled = true;
    prevBtn.setAttribute('aria-disabled', 'true');
  } else {
    prevBtn.disabled = false;
    prevBtn.setAttribute('aria-disabled', 'false');
  }

  // Deshabilitar botón derecho si está al final
  if (scrollLeft >= maxScroll - 10) {
    nextBtn.disabled = true;
    nextBtn.setAttribute('aria-disabled', 'true');
  } else {
    nextBtn.disabled = false;
    nextBtn.setAttribute('aria-disabled', 'false');
  }
}

/**
 * Obtener vista actual
 * @returns {string} 'grid' o 'carousel'
 */
export function getCurrentView() {
  return currentView;
}
