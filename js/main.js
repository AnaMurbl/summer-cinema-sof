// ===============================
// MAIN.JS - Inicialización de la aplicación
// ===============================

import { getFilms } from './api.js';
import { displayFilms, showLoading, showNotification } from './ui.js';
import { initForms } from './forms.js';

async function loadFilms(){
  try{
    showLoading();
    const films = await getFilms();
    displayFilms(films, 'grid'); // ⇦ solo grid
  }catch(error){
    console.error(error);
    showNotification('Error al cargar las películas', 'error');
  }
}

function init(){
  console.log('🎬 Cine de Verano - Iniciando aplicación');
  initForms();     // sin initCarousel
  loadFilms();
  console.log('✅ Aplicación inicializada correctamente');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
}else{
  init();
}
