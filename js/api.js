// ===============================
// API.JS - Llamadas a la API
// ===============================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINT = `${API_BASE_URL}/films`;

/**
 * Obtener todas las películas
 * @returns {Promise<Array>} Lista de películas
 */
export async function getFilms() {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const films = await response.json();
    console.log('Películas obtenidas:', films);
    return films;

  } catch (error) {
    console.error('Error al obtener películas:', error.message);
    throw error;
  }
}

/**
 * Crear una nueva película
 * @param {Object} filmData - Datos de la película
 * @returns {Promise<Object>} Película creada
 */
export async function createFilm(filmData) {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const createdFilm = await response.json();
    console.log('Película creada:', createdFilm);
    return createdFilm;

  } catch (error) {
    console.error('Error al crear película:', error.message);
    throw error;
  }
}

/**
 * Actualizar una película existente
 * @param {string} id - ID de la película
 * @param {Object} filmData - Datos actualizados
 * @returns {Promise<Object>} Película actualizada
 */
export async function updateFilm(id, filmData) {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const updatedFilm = await response.json();
    console.log('Película actualizada:', updatedFilm);
    return updatedFilm;

  } catch (error) {
    console.error('Error al actualizar película:', error.message);
    throw error;
  }
}

/**
 * Eliminar una película
 * @param {string} id - ID de la película
 * @returns {Promise<void>}
 */
export async function deleteFilm(id) {
  try {
    const response = await fetch(`${API_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    console.log(`Película ${id} eliminada`);

  } catch (error) {
    console.error('Error al eliminar película:', error.message);
    throw error;
  }
}
