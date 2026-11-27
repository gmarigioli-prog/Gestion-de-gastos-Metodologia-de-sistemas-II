# FinanzApp - Gestor personal de gastos

Aplicación web para registrar y visualizar movimientos financieros personales. Permite crear una cuenta local, iniciar sesión y llevar un control separado de **ingresos, gastos y ahorros** desde el navegador.

El proyecto se desarrolla como parte de la materia **Metodología de Sistemas II** de la Tecnicatura Universitaria en Programación de la UTN durante el año 2026.

## Funcionalidades

- Registro e inicio de sesión de usuarios en el navegador.
- Sesión persistida con `localStorage`.
- Contraseña representada mediante un hash SHA-256 generado en el cliente.
- Registro de ingresos, gastos y ahorros.
- Cálculo automático de:
  - Balance disponible.
  - Total de ingresos.
  - Total de gastos.
  - Total de ahorros.
- Separación de movimientos por usuario.
- Listado de actividad ordenado por la fecha de registro.
- Formato de moneda y fechas para Argentina.

> Los datos creados desde la interfaz se almacenan exclusivamente en el `localStorage` del navegador. No existe actualmente una conexión activa con una base de datos ni una API del servidor para los movimientos financieros.

## Tecnologías

- Node.js
- Express
- JavaScript
- HTML y CSS
- Vitest
- Prisma y JWT como dependencias preparadas para una futura integración

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Git

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/gmarigioli-prog/Gestion-de-gastos-Metodologia-de-sistemas-II.git
cd Gestion-de-gastos-Metodologia-de-sistemas-II
```

2. Instalar las dependencias:

```bash
npm install
```

## Ejecución

Iniciar el servidor con recarga automática:

```bash
npm run dev
```

Iniciar el servidor normalmente:

```bash
npm start
```

Abrir `http://localhost:3000` en el navegador.

La aplicación expone además el endpoint de estado:

```text
GET /health
```

Respuesta:

```json
{
  "status": "ok"
}
```

El puerto puede configurarse mediante la variable de entorno `PORT`:

```bash
PORT=4000 npm start
```

En Windows PowerShell:

```powershell
$env:PORT=4000
npm start
```

## Uso

1. Abrir la aplicación.
2. Registrar una cuenta o iniciar sesión.
3. Completar el formulario con tipo de movimiento, descripción, monto y fecha.
4. Guardar el registro.
5. Consultar el balance y los totales calculados en la pantalla principal.
6. Cerrar sesión desde el encabezado cuando corresponda.

Los usuarios y movimientos quedan vinculados al perfil activo en el navegador. Borrar los datos del sitio elimina esta información local.

## Pruebas

Ejecutar toda la suite:

```bash
npm test
```

Las pruebas cubren el modelo de usuario, el controlador de usuarios, las rutas y la factory de notificaciones.

## Arquitectura del proyecto

```text
.
├── public/
│   ├── app.js        # Interacción del navegador y persistencia local
│   ├── index.html    # Interfaz de autenticación y movimientos
│   └── styles.css    # Estilos de la aplicación
├── src/
│   ├── controllers/  # Operaciones CRUD sobre usuarios
│   ├── factories/    # Factory de notificaciones
│   ├── models/       # Modelo de usuario
│   ├── routes/       # Rutas CRUD de usuarios
│   └── index.js      # Servidor Express y archivos estáticos
├── tests/
│   ├── integration/  # Pruebas de integración
│   └── unit/         # Pruebas unitarias
├── docs/
│   └── decisiones.md # Patrones y decisiones de diseño
├── package.json
└── README.md
```

## Estado y próximos pasos

El proyecto cuenta con una interfaz funcional y una base modular en el servidor. Entre las mejoras previstas se encuentran:

- Integrar usuarios y movimientos con una base de datos y un backend completo.
- Proteger rutas y autenticar usuarios con JWT.
- Cifrar contraseñas con bcrypt.
- Completar las operaciones de la API de usuarios.
- Completar el envío de notificaciones por correo mediante la factory existente.

## Integrantes

- Painenahuel Luna Ignacio
- Zanconi Gianluca
- Marigioli Gino
- Federico Luengo

## Documentación adicional

Las decisiones técnicas y los patrones considerados están documentados en [docs/decisiones.md](docs/decisiones.md).
