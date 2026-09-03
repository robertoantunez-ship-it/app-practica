# Evaluación Módulo 3 - Aplicación NativeScript + Angular + Express + Redux

Aplicación móvil nativa desarrollada con NativeScript y Angular que integra consumo de API remota en Express mediante un túnel Ngrok, gestión de estado reactivo global mediante un Store de Redux personalizado, y persistencia local de configuraciones de usuario con `ApplicationSettings`.

---

## 🚀 Requisitos Previos

* **Node.js**: v18 o superior
* **NativeScript CLI**: `npm install -g nativescript`
* **Ngrok CLI**

---

## 🛠️ Guía de Ejecución

### 1. Inicializar la API Backend (Express)
```bash
# Acceder a la carpeta del servidor backend
cd backend

# Instalar dependencias
npm install

# Iniciar servidor Express
node index.js
La API estará escuchando en http://localhost:3000.

2. Configurar el Túnel de Ngrok
Bash
ngrok http 3000
Copia la URL HTTPS generada (ejemplo: https://abcd-123.ngrok-free.app) y pégala en la constante apiUrl dentro del servicio Angular (src/app/services/hotel.service.ts).

3. Ejecutar la Aplicación NativeScript
Bash
# En la raíz del proyecto NativeScript
npm install

# Ejecutar en emulador o dispositivo Android
ns run android