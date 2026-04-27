# HANECHI NOTEBOOK

**Proyecto de Fin de Ciclo del Grado Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)** realizado en ESIC para la promoción 2025-2026.



## DRESCRIPCIÓN GENERAL

**Hanechi NoteBook** es una red social orientada en la creacion de cuadernos de notas, diseñada con un fuerte enfoque en la experiencia de usuario. La aplicación permite a los usuarios centralizar sus anotaciones en un entorno digital y compartirlos con otros usuarios.



## REQUISITOS PREVIOS

Antes de comenzar la instalación, asegúrate de tener instalado en tu entorno:

- **Java JDK 21** o superior.

- **Node.js** (Versión LTS recomendada).

- **PostgreSQL 15** o superior con una base de datos creada.

- **Maven** para la gestión de dependencias del backend.



## INSTALACIÓN Y CONFIGURACIÓN

### 1. Clonar el repositorio
```bash
    git clone https://github.com/AlejandroDastard/Hanechi-Notebook.git
    cd Hanechi-Notebook
```


### 2. Configuración del Backend

1. Navega a la carpeta `backend/`.

2. Copia el archivo `.env.template` y renombralo como `.env`.

3. Rellena las variables con tus credenciales locales:

4. Ejecuta el proyecto:

```bash
    mvn clean install
    mvn spring-boot:run
```


### 3. Configuración del Frontend

1. Navega a la carpeta `frontend/`.

2. Copia el archivo `.env.template` y renombralo como `.env`.

3. Ajusta la URL de la API:

    - Usa `10.0.2.2` si utilizas el emulador de Android Studio.

    - Usa tu IP local si pruebas en un dispositivo físico.

4. Instala las dependencias e inicia Expo:

```bash
    npm install
    npx expo start
```



## ESTRUCTURA

- `/backend`: Contiene la API de Spring Boot, incluyendo la lógica de negocio, seguridad y acceso a datos.

- `/database`: Script de seeder para la tabla `Etiqueta`.

- `/docs`: Documentación técnica del PFC

- `/frontend`: Contiene la aplicación móvil desarrollada con React Native y Expo.