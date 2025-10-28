// ===============================
// FORMS.JS - Gestión de formularios
// ===============================

import { createFilm, updateFilm, deleteFilm, getFilms } from './api.js';
import { displayFilms, showNotification, toggleModal, fillEditForm, showLoading, announceToScreenReader } from './ui.js';

/** Inicializar gestión de formularios */
export function initForms(){
  // Botón abrir formulario de agregar
  const addBtn = document.getElementById('add-film-btn');
  addBtn?.addEventListener('click', () => toggleModal('add-film-modal', true));

  // Botones cerrar formularios
  document.querySelectorAll('.form-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', closeAllModals);
  });

  // Botones cancelar
  document.getElementById('cancel-add-btn')?.addEventListener('click', () => {
    toggleModal('add-film-modal', false);
  });
  document.getElementById('cancel-edit-btn')?.addEventListener('click', () => {
    toggleModal('edit-film-modal', false);
  });

  // Submit formularios
  document.getElementById('add-film-form')?.addEventListener('submit', handleAddFilm);
  document.getElementById('edit-film-form')?.addEventListener('submit', handleEditFilm);

  // Cerrar modal con ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){ closeAllModals(); }
  });

  // Delegación de eventos para editar/eliminar
  document.getElementById('films-container')?.addEventListener('click', handleCardActions);
}

/** Manejar agregar película */
async function handleAddFilm(e){
  e.preventDefault();

  const formData = new FormData(e.target);
  const newFilm = {
    title: (formData.get('title') || '').toString().trim(),
    director: (formData.get('director') || '').toString().trim(),
    description: (formData.get('description') || '').toString().trim(),
    image: ((formData.get('image') || '')).toString().trim() || null
  };

  if(!newFilm.title || !newFilm.director || !newFilm.description){
    showNotification('Por favor, completa todos los campos obligatorios', 'error');
    return;
  }

  try{
    showLoading();
    await createFilm(newFilm);

    const films = await getFilms();
    displayFilms(films, 'grid');

    toggleModal('add-film-modal', false);
    showNotification('¡Película agregada exitosamente!');
    announceToScreenReader(`Película ${newFilm.title} agregada`);
  }catch(error){
    console.error(error);
    showNotification('Error al agregar la película', 'error');
  }
}

/** Manejar editar película */
async function handleEditFilm(e){
  e.preventDefault();

  const formData = new FormData(e.target);
  const id = formData.get('id');

  const updatedFilm = {
    title: (formData.get('title') || '').toString().trim(),
    director: (formData.get('director') || '').toString().trim(),
    description: (formData.get('description') || '').toString().trim(),
    image: ((formData.get('image') || '')).toString().trim() || null
  };

  if(!updatedFilm.title || !updatedFilm.director || !updatedFilm.description){
    showNotification('Por favor, completa todos los campos obligatorios', 'error');
    return;
  }

  try{
    showLoading();
    await updateFilm(id, updatedFilm);

    const films = await getFilms();
    displayFilms(films, 'grid');

    toggleModal('edit-film-modal', false);
    showNotification('¡Película actualizada exitosamente!');
    announceToScreenReader(`Película ${updatedFilm.title} actualizada`);
  }catch(error){
    console.error(error);
    showNotification('Error al actualizar la película', 'error');
  }
}

/** Delegación para botones de editar/eliminar */
async function handleCardActions(e){
  const target = e.target;

  // Editar
  if(target.classList.contains('btn-edit') || target.closest('.btn-edit')){
    const btn = target.classList.contains('btn-edit') ? target : target.closest('.btn-edit');
    const filmId = btn.dataset.filmId;
    await handleEditClick(filmId);
  }

  // Eliminar
  if(target.classList.contains('btn-delete') || target.closest('.btn-delete')){
    const btn = target.classList.contains('btn-delete') ? target : target.closest('.btn-delete');
    const filmId = btn.dataset.filmId;
    await handleDeleteClick(filmId);
  }
}

/** Abrir formulario de edición */
async function handleEditClick(filmId){
  try{
    const films = await getFilms();
    const film = films.find(f => f.id === filmId);

    if(!film){
      showNotification('No se encontró la película', 'error');
      return;
    }

    fillEditForm(film);
    toggleModal('edit-film-modal', true);
    announceToScreenReader(`Editando película ${film.title}`);
  }catch(error){
    console.error(error);
    showNotification('Error al cargar los datos de la película', 'error');
  }
}

/** Confirmar y eliminar película */
async function handleDeleteClick(filmId){
  try{
    const films = await getFilms();
    const film = films.find(f => f.id === filmId);

    if(!film){
      showNotification('No se encontró la película', 'error');
      return;
    }

    const confirmed = confirm(`¿Estás segura de que quieres eliminar "${film.title}"?\n\nEsta acción no se puede deshacer.`);
    if(!confirmed){
      announceToScreenReader('Eliminación cancelada');
      return;
    }

    showLoading();
    await deleteFilm(filmId);

    const updatedFilms = await getFilms();
    displayFilms(updatedFilms, 'grid');

    showNotification('¡Película eliminada exitosamente!');
    announceToScreenReader(`Película ${film.title} eliminada`);
  }catch(error){
    console.error(error);
    showNotification('Error al eliminar la película', 'error');
  }
}

/** Cerrar todos los modales */
function closeAllModals(){
  toggleModal('add-film-modal', false);
  toggleModal('edit-film-modal', false);
}
