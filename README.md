# 🎬 Cine de Verano — Summer Cinema

Aplicación web interactiva para gestionar una colección personal de películas (CRUD) con **JavaScript vanilla modular**, diseño accesible y tipografía cinematográfica.

> 💡 **Nota:**
> El proyecto ha sido refactorizado con una estructura más modular, similar a React pero con JavaScript vanilla.
> Los servicios y la lógica de interfaz están separados para facilitar el mantenimiento y la comprensión.

---

## 📋 Descripción del Proyecto

Cine de Verano permite **crear, visualizar, editar y eliminar** películas en una colección personal, utilizando un servidor JSON local como fuente de datos.

* **Crear (`POST`):** agregar nuevas películas
* **Leer (`GET`):** ver todas las películas
* **Actualizar (`PUT`):** editar información existente
* **Eliminar (`DELETE`):** borrar una película de la base de datos

---

## 🛠️ Tecnologías Utilizadas

* **HTML5:** estructura semántica
* **CSS3:** estilos modulares (`base`, `layout`, `components`, `forms`, `accessibility`)
* **JavaScript (ES6+):** lógica modular para servicios, interfaz y formularios
* **JSON Server:** simulación de API REST para desarrollo local

---

## 📁 Estructura del Proyecto
````summer-cinema-sof/
├── css/
│ ├── accessibility.css # WCAG 2.1 AA tweaks (focus, motion-reduced, etc.)
│ ├── base.css # variables, reset, typography (Inter + Playfair)
│ ├── components.css # cards, buttons, states
│ ├── forms.css # modal + form controls (accessible)
│ └── layout.css # background image + unified panels (header/section)
│
├── js/
│ ├── api.js # CRUD calls to JSON Server (services)
│ ├── forms.js # form handlers (add/edit/delete flow)
│ ├── ui.js # DOM rendering (cards, notifications, modals)
│ └── main.js # app bootstrap (load/initialize)
│ # removed: carousel.js (grid-only view now)
│
├── server/
│ └── db.json # mock database (movies)
│
├── index.html # entry point
├── package.json # scripts (api, dev)
├── .gitignore
└── README.md
````

### 🧭 Services Map (where to look)
- **`js/api.js`** → All API/CRUD functions:  
  - `GET /films`  
  - `POST /films`  
  - `PUT /films/:id`  
  - `DELETE /films/:id`
- **`js/forms.js`** → Form submit handlers, delete confirmations, and UI refresh after mutations.
- **`js/ui.js`** → `displayFilms()`, `createMovieCard()`, notifications, modal toggles.
- **`js/main.js`** → App initialization: loads films in **grid** view and hooks up forms.
````
---

## 🚀 Setup & Run

### Prerequisites
- **Node.js** ≥ 14
- **npm** ≥ 6

### Install
```bash
npm install

