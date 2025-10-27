# 🎬 Cine de Verano - Summer Cinema

Una aplicación web para gestionar una colección de películas para practicar las operaciones CRUD.

## 📋 Descripción del Proyecto

Cine de Verano es una aplicación interactiva que permite a los usuarios gestionar su colección personal de películas. La aplicación implementa las cuatro operaciones básicas de gestión de datos (CRUD):

- **Crear** (POST): Agregar nuevas películas a la colección
- **Leer** (GET): Visualizar todas las películas almacenadas
- **Actualizar** (PUT): Editar información de películas existentes
- **Eliminar** (DELETE): Borrar películas de la colección

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica de la aplicación
- **CSS3**: Estilos visuales con efectos glass-morphism
- **JavaScript (ES6+)**: Lógica de la aplicación y peticiones fetch
- **JSON Server**: Simulación de API REST para desarrollo

## 📁 Estructura del Proyecto

```
summer-cinema-sof/
│
├── server/
│   └── db.json                 # Base de datos JSON con películas
│
├── src/
│   ├── index.html             # Página principal
│   ├── services.js            # Lógica CRUD y peticiones API
│   ├── summer.css             # Estilos de la aplicación
│   └── summer-pic.jpg         # Imagen de fondo
│
├── package.json               # Configuración del proyecto
├── .gitignore                # Archivos ignorados por Git
└── README.md                 # Documentación del proyecto
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

### Pasos de Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Sofiareyes12/summer-cinema-sof.git
cd summer-cinema-sof
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Iniciar el servidor JSON:**
```bash
npm run api
```

El servidor se ejecutará en `http://localhost:3000`

4. **Abrir la aplicación:**
- Abre el archivo `src/index.html` en tu navegador
- O utiliza Live Server de VS Code para mejor experiencia

## 📖 Uso de la Aplicación

### Agregar una Película
1. Haz clic en el botón flotante `+` en la parte inferior derecha
2. Completa el formulario con los datos de la película
3. Haz clic en "Agregar Película"

### Editar una Película
1. Localiza la película en el carousel
2. Haz clic en el botón "✏️ Editar"
3. Modifica los datos deseados
4. Haz clic en "Actualizar Película"

### Eliminar una Película
1. Localiza la película en el carousel
2. Haz clic en el botón "🗑️ Eliminar"
3. Confirma la eliminación en el diálogo

## 🔧 API Endpoints

La aplicación consume los siguientes endpoints:

- `GET /films` - Obtener todas las películas
- `POST /films` - Crear una nueva película
- `PUT /films/:id` - Actualizar una película específica
- `DELETE /films/:id` - Eliminar una película específica

## ✨ Características

- ✅ Interfaz intuitiva con diseño glass-morphism
- ✅ Validación de formularios
- ✅ Notificaciones de éxito/error
- ✅ Confirmación antes de eliminar
- ✅ Responsive design
- ✅ Efectos visuales suaves

## 👥 Autoras

- **Sofía Reyes** - [GitHub](https://github.com/Sofiareyes12)
- **Ana Muruzabal** - [Github] (https://github.com/AnaMurbl)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, por favor abre un issue en el repositorio.

---

**Proyecto desarrollado como parte del bootcamp de Full Stack de Factoría F5** 🚀
